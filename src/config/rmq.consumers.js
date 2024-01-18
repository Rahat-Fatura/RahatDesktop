const { Notification } = require('electron');
const { rahatsistem, documentService } = require('../services');
const queryHelper = require('../helpers/query.helper');
const { instance } = require('../instances/rmq.instance');
const isAppActive = require('../utils/appIsActive');
const config = require('./config');
const logger = require('./logger');

const consumeTunnel = async () => {
  if (!isAppActive() || !config.get('rmq')) {
    logger.info('RahatDesktop is not active or RMQ is not activated.');
    return;
  }
  let rmqCode;
  try {
    rmqCode = (await rahatsistem.getRMQCode()).rmq_code;
  } catch (error) {
    const NOTIFICATION_TITLE = 'RahatDesktop Aktif';
    const NOTIFICATION_BODY = 'Uygulama ayakta ancak sistem kanalına bağlanılamadı!';
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show();
    logger.error(error);
    return;
  }
  // eslint-disable-next-line no-unused-vars
  const connection = await instance('localapp_coms');
  const queue = `localApp.tunnel.${rmqCode}.edoc`;
  const channel = connection.createChannel({
    json: true,
    setup: (cha) => {
      return cha.assertQueue(queue, { durable: true });
    },
  });

  const NOTIFICATION_TITLE = 'RahatDesktop Aktif';
  const NOTIFICATION_BODY = 'Sistem kanalına başarıyla bağlanıldı.';
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show();

  channel.consume(queue, async (data) => {
    const msg = JSON.parse(data.content.toString());
    const moveLog = await documentService.createDocumentRecord(msg.data.erpId, '0', null, 'notify', 'notify.main', 'notify');
    if (msg.type === 'status.update') {
      await documentService.updateDocumentRecord(
        moveLog.id,
        msg.data.erpId,
        msg.data.new.ref_no,
        msg,
        `${msg.code}.statusUpdate.notify`,
        `notify.${msg.code}.statusUpdate`,
        'notify',
      );
      if (msg.data.edoc_status === 202) {
        let success = true;
        try {
          // TODO: Update document number in local database
          const { erpId } = msg.data;
          const newDocumentNumber = msg.data.new.document_number;
          if (msg.code === 'invoice') {
            await queryHelper.runUpdateInvoiceNumberQuery(erpId, newDocumentNumber);
          } else if (msg.code === 'despatch') {
            await queryHelper.runUpdateDespatchNumberQuery(erpId, newDocumentNumber);
          }
        } catch (error) {
          logger.error(error);
          await documentService.updateDocumentRecord(
            moveLog.id,
            msg.data.erpId,
            msg.data.new.ref_no,
            msg,
            `${msg.code}.statusUpdate.error`,
            `notify.${msg.code}.statusUpdate`,
            'notify',
            error,
          );
          success = false;
        }
        if (success) {
          await documentService.updateDocumentRecord(
            moveLog.id,
            msg.data.erpId,
            msg.data.new.ref_no,
            msg,
            `${msg.code}.statusUpdate.successful`,
            `notify.${msg.code}.statusUpdate`,
            'notify',
          );
        }
      } else {
        await documentService.updateDocumentRecord(
          moveLog.id,
          msg.data.erpId,
          msg.data.new.ref_no,
          msg,
          `${msg.code}.statusUpdate.successful`,
          `notify.${msg.code}.statusUpdate`,
          'notify',
        );
      }
    } else if (msg.type === 'data.refresh') {
      await documentService.updateDocumentRecord(
        moveLog.id,
        msg.data.erpId,
        msg.data.ref_no,
        msg,
        `${msg.code}.dataRefresh.notify`,
        `notify.${msg.code}.dataRefresh`,
        'notify',
      );
      const updatedDoc = await documentService.upsertDocument(msg.data.erpId, 'checked', msg.code);
      if (!updatedDoc.success) {
        await documentService.updateDocumentRecord(
          moveLog.id,
          msg.data.erpId,
          msg.data.ref_no,
          msg,
          `${msg.code}.dataRefresh.error`,
          `notify.${msg.code}.dataRefresh`,
          'notify',
          updatedDoc.error,
        );
      } else {
        await documentService.updateDocumentRecord(
          moveLog.id,
          msg.data.erpId,
          msg.data.ref_no,
          msg,
          `${msg.code}.dataRefresh.successful`,
          `notify.${msg.code}.dataRefresh`,
          'notify',
        );
      }
    }
    channel.ack(data);
  });
};

module.exports = { consumeTunnel };
