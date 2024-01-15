const httpStatus = require('http-status');
const axios = require('axios');
const { GraphQLClient } = require('graphql-request');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const backend = axios.create({
  baseURL: config.get('url'),
});

backend.interceptors.request.use((request) => {
  request.headers['Content-Type'] = 'application/json';
  request.headers['api-key'] = config.get('apikey');
  return request;
});

backend.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      throw new ApiError(httpStatus.BAD_GATEWAY, 'Servise erişilemiyor.');
    }
    throw new ApiError(error.response.status, error.response.data.message);
  },
);

const graphqlClient = new GraphQLClient(`${config.get('url')}/graphql`, {
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = { backend, graphqlClient };
