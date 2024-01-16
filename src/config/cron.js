/* eslint-disable no-await-in-loop */
const cron = require('node-cron');
const { Notification } = require('electron');
const queryHelper = require('../helpers/query.helper');
const { settingsService, documentService } = require('../services');
const logger = require('./logger');
const isAppActive = require('../utils/appIsActive');

const checkUnsendedInvoices = async (app) => {
  if (app.get('isSendingInvoices')) {
    return;
  }
  app.set('isSendingInvoices', true);
  let invoices;
  try {
    invoices = await queryHelper.runCheckUnsendedInvoiceQuery();
  } catch (error) {
    logger.error(error);
    app.set('isSendingInvoices', false);
    return;
  }
  if (!invoices || invoices.length === 0) {
    app.set('isSendingInvoices', false);
    return;
  }
  const companyConfig = await settingsService.getCompanyConfig();
  const tryCount = companyConfig.settings.checkUnsendedInvoice.failedTryCount;
  // eslint-disable-next-line no-restricted-syntax
  for (const invoice of invoices) {
    let willSend = false;
    try {
      const invoicesInDatabase = await documentService.getDocumentsById(invoice.external_id);
      if (!invoicesInDatabase.length) {
        willSend = true;
      } else {
        const successful = invoicesInDatabase.filter((i) => i.status === 200);
        const failed = invoicesInDatabase.filter((i) => i.status !== 200);
        if (successful.length === 0 && failed.length <= tryCount) {
          willSend = true;
        }
      }
      if (willSend) {
        await documentService.upsertDocument(String(invoice.external_id), 'checked', 'invoice');
      }
    } catch (error) {
      logger.error(error);
    }
  }
  app.set('isSendingInvoices', false);
};

const checkUnsendedDespatches = async (app) => {
  if (app.get('isSendingDespatches')) {
    return;
  }
  app.set('isSendingDespatches', true);
  let despatches;
  try {
    despatches = await queryHelper.runCheckUnsendedDespatchQuery();
  } catch (error) {
    logger.error(error);
    app.set('isSendingDespatches', false);
    return;
  }
  if (!despatches || despatches.length === 0) {
    app.set('isSendingDespatches', false);
    return;
  }
  const companyConfig = await settingsService.getCompanyConfig();
  const tryCount = companyConfig.settings.checkUnsendedDespatch.failedTryCount;
  // eslint-disable-next-line no-restricted-syntax
  for (const despatch of despatches) {
    let willSend = false;
    try {
      const despatchesInDatabase = await documentService.getDocumentsById(despatch.external_id);
      if (!despatchesInDatabase.length) {
        willSend = true;
      } else {
        const successful = despatchesInDatabase.filter((i) => i.status === 200);
        const failed = despatchesInDatabase.filter((i) => i.status !== 200);
        if (successful.length === 0 && failed.length <= tryCount) {
          willSend = true;
        }
      }
      if (willSend) {
        await documentService.upsertDocument(String(despatch.external_id), 'checked', 'despatch');
      }
    } catch (error) {
      logger.error(error);
    }
  }
  app.set('isSendingDespatches', false);
};

const initCron = async (app) => {
  if (!isAppActive()) {
    return;
  }
  const companyConfig = await settingsService.getCompanyConfig();
  const checkUnsendedInvoicePeriod = companyConfig.settings.checkUnsendedInvoice.workingPeriod;
  const checkUnsendedDespatchPeriod = companyConfig.settings.checkUnsendedDespatch.workingPeriod;
  cron.schedule(checkUnsendedInvoicePeriod, () => {
    checkUnsendedInvoices(app);
  });
  cron.schedule(checkUnsendedDespatchPeriod, () => {
    checkUnsendedDespatches(app);
  });
  const NOTIFICATION_TITLE = 'RahatDesktop Aktif';
  const NOTIFICATION_BODY = 'Düzenli sistem kontrolü aktif edildi.';
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show();
};

module.exports = initCron;
