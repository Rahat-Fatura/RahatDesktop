const amqp = require('amqplib');
const { settingsService } = require('../services');
const logger = require('../config/logger');

let connection;
let channel;

const instance = async (host) => {
  if (!connection) {
    const url = (await settingsService.getCompanyConfig()).services.rabbitmq[host];
    connection = await amqp.connect(url);
  }
  if (!channel) {
    channel = await connection.createChannel();
    connection.on('error', (err) => {
      logger.error(`rabbitmq-error-global-0 :>> ${err}`);
    });
  }
  return [connection, channel];
};

module.exports = { instance };
