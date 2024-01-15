const mssql = require('mssql');
const httpStatus = require('http-status');
const backendService = require('./backend.service');
const ApiError = require('../utils/ApiError');

const checkKey = async (key) => {
  const checked = await backendService.graphql.getCompany(key);
  return checked;
};

const checkMSSQLString = async (mssqlString) => {
  const sqlConnection = await mssql.connect(mssqlString);
  sqlConnection.close();
};

const getERPApps = async () => {
  const erpApps = await backendService.graphql.getApps();
  return erpApps;
};

const getAppVariables = async (id) => {
  const appVariables = await backendService.graphql.getAppVariables(id);
  return appVariables;
};

const completeSetup = async (mssqlString, erpAppId, variables, key) => {
  try {
    await checkMSSQLString(mssqlString);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'MSSQL bağlantı bilgileri hatalı! Lütfen bağlantı bilgisini test ediniz!');
  }
  const createCompany = await backendService.graphql.createCompany(mssqlString, erpAppId, variables, key);
  return createCompany;
};

module.exports = {
  checkKey,
  checkMSSQLString,
  getERPApps,
  getAppVariables,
  completeSetup,
};
