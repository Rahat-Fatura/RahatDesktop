/* eslint-disable dot-notation */
/* eslint-disable no-await-in-loop */
const dateAndTime = require('date-and-time');
const { connect } = require('../utils/mssql');
const { settingsService } = require('../services');

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

const runAllInvoiceQuery = async (id) => {
  const invoiceConfig = await settingsService.getInvoiceConfig();
  const companyConfig = await settingsService.getCompanyConfig();
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

module.exports = {
  runAllInvoiceQuery,
  runAllDespatchQuery,
  runCheckUnsendedInvoiceQuery,
  runCheckUnsendedDespatchQuery,
  runUpdateInvoiceNumberQuery,
  runUpdateDespatchNumberQuery,
};
