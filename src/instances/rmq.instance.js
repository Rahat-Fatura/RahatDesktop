const amqp = require('amqp-connection-manager');
const { settingsService } = require('../services');
// const logger = require('../config/logger');

let connection;

const instance = async (host) => {
  if (!connection) {
    const url = (await settingsService.getCompanyConfig()).services.rabbitmq[host];
    connection = amqp.connect(url);
  }
  // if (!channel) {
  //   channel = await connection.createChannel();
  //   connection.on('error', (err) => {
  //     logger.error(`rabbitmq-error-global-0 :>> ${err}`);
  //   });
  // }
  return connection;
};

module.exports = { instance };
