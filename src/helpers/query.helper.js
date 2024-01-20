/* eslint-disable dot-notation */
/* eslint-disable no-await-in-loop */
const dateAndTime = require('date-and-time');
const addZero = require('add-zero');
const config = require('../config/config');
const { settingsService } = require('../services');
const rahatsistem = require('../services/rahatsistem.service');
const { connect } = require('../utils/mssql');

const normalizeQueries = async (invoiceConfig, variables) => {
  const { queries } = invoiceConfig;
  const variableKeys = Object.keys(variables);
  const configKeys = Object.keys(queries);
  for (let i = 0; i < configKeys.length; i += 1) {
    for (let j = 0; j < variableKeys.length; j += 1) {
      const configKey = configKeys[i];
      const configValue = queries[configKey];
      const variableKey = variableKeys[j];
      const variableValue = variables[variableKey];
      queries[configKey] = configValue.replaceAll(`{{${variableKey}}}`, variableValue);
    }
  }
  return queries;
};

const runUpdateInvoiceNumberQuery = async (id, newNumber) => {
  const invoiceConfig = await settingsService.getInvoiceConfig();
  const companyConfig = await settingsService.getCompanyConfig();
  const queries = await normalizeQueries(invoiceConfig, companyConfig.variables);
  const updateInvoiceNumberQuery = queries.update_number;
  if (!updateInvoiceNumberQuery) throw new Error('Fatura numarası güncelleme sorgusu bulunamadı.');
  const sql = await connect();
  await sql.input('erpId', id).input('invNo', newNumber);
  await sql.query(updateInvoiceNumberQuery);
  return true;
};

const runUpdateDespatchNumberQuery = async (id, newNumber) => {
  const despatchConfig = await settingsService.getDespatchConfig();
  const companyConfig = await settingsService.getCompanyConfig();
  const queries = await normalizeQueries(despatchConfig, companyConfig.variables);
  const updateDespatchNumberQuery = queries.update_number;
  if (!updateDespatchNumberQuery) throw new Error('İrsaliye numarası güncelleme sorgusu bulunamadı.');
  const sql = await connect();
  await sql.input('erpId', id).input('dsp', newNumber);
  await sql.query(updateDespatchNumberQuery);
  return true;
};

const checkLiability = async (tax) => {
  let liability;
  try {
    await rahatsistem.checkLiability(tax);
    liability = 'einvoice';
  } catch (error) {
    if (JSON.parse(error.message).code === 404) {
      liability = 'earchive';
    } else {
      throw new Error(error);
    }
  }
  return liability;
};

const updateNewNumber = async (compConf, id, tax, datetime) => {
  const companyConfig = compConf;
  const liability = await checkLiability(tax);
  const userSerie = config.get(`nbsDocuments.${liability}.serie`);
  if (!userSerie) throw new Error('Önceden numaralandırma aktif edilmiş ancak seri tanımlanmamış!');
  const isActiveByLiability = companyConfig.settings.nbsDocuments[liability].numbering;
  if (isActiveByLiability) {
    const invoiceYear = dateAndTime.format(new Date(datetime), 'YYYY', true);
    if (!companyConfig.settings.nbsDocuments[liability]['series'])
      companyConfig.settings.nbsDocuments[liability]['series'] = {};
    if (!companyConfig.settings.nbsDocuments[liability]['series'][userSerie])
      companyConfig.settings.nbsDocuments[liability]['series'][userSerie] = {};
    if (!companyConfig.settings.nbsDocuments[liability]['series'][userSerie][invoiceYear])
      companyConfig.settings.nbsDocuments[liability]['series'][userSerie][invoiceYear] = 0;
    const lastNumber = companyConfig.settings.nbsDocuments[liability]['series'][userSerie][invoiceYear];
    const newNumber = lastNumber + 1;
    const newInvoiceNumber = `${userSerie}${invoiceYear}${addZero(newNumber, 9)}`;
    if (newInvoiceNumber.length !== 16)
      throw new Error(`Oluşturulan fatura numarası 16 haneden farklı oluştu! Numara: ${newInvoiceNumber}`);
    await runUpdateInvoiceNumberQuery(id, newInvoiceNumber);
    companyConfig.settings.nbsDocuments[liability]['series'][userSerie][invoiceYear] = newNumber;
    await settingsService.updateCompanyConfig(companyConfig);
  }
  return true;
};

const runAllInvoiceQuery = async (id) => {
  const invoiceConfig = await settingsService.getInvoiceConfig();
  let companyConfig = await settingsService.getCompanyConfig();
  const queries = await normalizeQueries(invoiceConfig, companyConfig.variables);
  const sql = await connect();
  const results = {
    main: {},
    customer: {},
    lines: [],
    notes: [],
    despatches: [],
    order: {},
  };
  await sql.input('erpId', id);
  [results.main] = (await sql.query(queries.main)).recordset;
  if (!results.main) {
    throw new Error('Fatura, ilgili SQL sorgusunda bulunamadı.');
  }
  [results.customer] = (await sql.query(queries.customer)).recordset;
  if (companyConfig.settings.numberBeforeSending && results.main.NumberOrSerie && results.main.NumberOrSerie.length !== 16) {
    await updateNewNumber(companyConfig, id, results.customer.TaxNumber, results.main.IssueDateTime);
    companyConfig = await settingsService.getCompanyConfig();
    [results.main] = (await sql.query(queries.main)).recordset;
  }
  results.lines = (await sql.query(queries.lines)).recordset;
  if (queries.notes) {
    results.notes = (await sql.query(queries.notes)).recordset;
  }
  if (queries.despatches) {
    results.despatches = (await sql.query(queries.despatches)).recordset;
  }
  if (queries.order) {
    [results.order] = (await sql.query(queries.order)).recordset;
  }
  for (let i = 0; i < results.lines.length; i += 1) {
    if (results.lines[i].ID) {
      const updatedQuery = queries.line_taxes.replaceAll('@lineId', results.lines[i].ID);
      results.lines[i]['Taxes'] = (await sql.query(updatedQuery)).recordset;
    }
  }
  return results;
};

const runAllDespatchQuery = async (id) => {
  const despatchConfig = await settingsService.getDespatchConfig();
  const companyConfig = await settingsService.getCompanyConfig();
  const queries = await normalizeQueries(despatchConfig, companyConfig.variables);
  const sql = await connect();
  const results = {
    main: {},
    customer: {},
    lines: [],
    notes: [],
    shipment_driver: {},
    shipment_carrier: {},
    shipment_delivery: {},
  };
  await sql.input('erpId', id);
  [results.main] = (await sql.query(queries.main)).recordset;
  if (!results.main) {
    throw new Error('İrsaliye, ilgili SQL sorgusunda bulunamadı.');
  }
  [results.customer] = (await sql.query(queries.customer)).recordset;
  results.lines = (await sql.query(queries.lines)).recordset;
  if (queries.notes) {
    results.notes = (await sql.query(queries.notes)).recordset;
  }
  if (queries.shipment_driver) {
    [results.shipment_driver] = (await sql.query(queries.shipment_driver)).recordset;
  }
  if (queries.shipment_carrier) {
    [results.shipment_carrier] = (await sql.query(queries.shipment_carrier)).recordset;
  }
  if (queries.shipment_delivery) {
    [results.shipment_delivery] = (await sql.query(queries.shipment_delivery)).recordset;
  }
  return results;
};

const runCheckUnsendedInvoiceQuery = async () => {
  const invoiceConfig = await settingsService.getInvoiceConfig();
  const companyConfig = await settingsService.getCompanyConfig();
  const queries = await normalizeQueries(invoiceConfig, companyConfig.variables);
  const unsendedInvoiceQuery = queries.check_unsended;
  const sql = await connect();
  const d = new Date() - 1000 * 60 * 60 * 24 * Number(companyConfig.settings.checkUnsendedInvoice.daysAgo);
  const dateTime = dateAndTime.format(new Date(d), companyConfig.settings.checkUnsendedInvoice.dateFormat, true);
  await sql.input('dateTime', dateTime);
  const results = (await sql.query(unsendedInvoiceQuery)).recordset;
  return results;
};

const runCheckUnsendedDespatchQuery = async () => {
  const despatchConfig = await settingsService.getDespatchConfig();
  const companyConfig = await settingsService.getCompanyConfig();
  const queries = await normalizeQueries(despatchConfig, companyConfig.variables);
  const unsendedDespatchQuery = queries.check_unsended;
  const sql = await connect();
  const d = new Date() - 1000 * 60 * 60 * 24 * Number(companyConfig.settings.checkUnsendedDespatch.daysAgo);
  const dateTime = dateAndTime.format(new Date(d), companyConfig.settings.checkUnsendedDespatch.dateFormat, true);
  await sql.input('dateTime', dateTime);
  const results = (await sql.query(unsendedDespatchQuery)).recordset;
  return results;
};

module.exports = {
  runAllInvoiceQuery,
  runAllDespatchQuery,
  runCheckUnsendedInvoiceQuery,
  runCheckUnsendedDespatchQuery,
  runUpdateInvoiceNumberQuery,
  runUpdateDespatchNumberQuery,
};
