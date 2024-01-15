const { Notification } = require('electron');
const config = require('../config/config');

const notify = (body) => {
  /**
   *   const document = {
      external_id: externalId,
      external_code: externalCode,
      json: json || null,
      status: documentsConfig[documentType][status].code,
      status_desc: documentsConfig[documentType][status].desc || JSON.stringify(error, Object.getOwnPropertyNames(error)),
      movement_type: documentsConfig.movementTypes[moveType],
      document_type: documentsConfig.documentTypes[documentType],
    };
   */
  if (body.status < 200 && (config.get('notification').notify || String(body.movement_type).includes('RFR'))) {
    const notification = new Notification({
      title: `${body.external_code} numaralı belge işleniyor.`,
      body: body.status_desc,
    });
    notification.show();
  } else if (body.status < 300 && (config.get('notification').success || String(body.movement_type).includes('RFR'))) {
    const notification = new Notification({
      title: `${body.external_code} numaralı belge sisteme gönderildi.`,
      body: body.status_desc,
    });
    notification.show();
  } else if (body.status >= 300 && config.get('notification').error) {
    const notification = new Notification({
      title: `${body.external_code} numaralı belge hata aldı!`,
      body: body.status_desc,
    });
    notification.show();
  }
};

module.exports = { notify };
