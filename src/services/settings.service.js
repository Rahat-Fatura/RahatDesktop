const backendService = require('./backend.service');
const config = require('../config/config');

const getInvoiceConfig = async () => {
  const companyWithQueries = await backendService.graphql.getCompanyQueries(config.get('apikey'));
  const invoiceQuery = companyWithQueries.Queries.find((query) => query.type === 'INVOICE');
  return invoiceQuery;
};

const getDespatchConfig = async () => {
  const companyWithQueries = await backendService.graphql.getCompanyQueries(config.get('apikey'));
  const despatchQuery = companyWithQueries.Queries.find((query) => query.type === 'DESPATCH');
  return despatchQuery;
};

const getCompanyConfig = async () => {
  const companyConfig = await backendService.graphql.getCompanyConfig(config.get('apikey'));
  return companyConfig;
};

const updateInvoiceConfig = async (queries) => {
  const updatedInvoiceConfig = await backendService.graphql.updateInvoiceConfig(config.get('apikey'), queries);
  return updatedInvoiceConfig;
};

const updateDespatchConfig = async (queries) => {
  const updatedDespatchConfig = await backendService.graphql.updateDespatchConfig(config.get('apikey'), queries);
  return updatedDespatchConfig;
};

const updateCompanyConfig = async (companyConfig) => {
  const updatedCompanyConfig = await backendService.graphql.updateCompanyConfig(config.get('apikey'), companyConfig);
  return updatedCompanyConfig;
};

module.exports = {
  getInvoiceConfig,
  getDespatchConfig,
  getCompanyConfig,
  updateInvoiceConfig,
  updateDespatchConfig,
  updateCompanyConfig,
};
