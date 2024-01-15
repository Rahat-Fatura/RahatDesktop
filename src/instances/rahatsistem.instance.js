const axios = require('axios');
const { settingsService } = require('../services');
const config = require('../config/config');

let backend;
const instance = async () => {
  if (!backend) {
    const { url } = (await settingsService.getCompanyConfig()).services.apiGateway;
    backend = axios.create({
      baseURL: url,
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
          throw new Error('Servise erişilemiyor.');
        }
        throw new Error(JSON.stringify(error.response.data));
      },
    );
    return backend;
  }
  return backend;
};

module.exports = { instance };
