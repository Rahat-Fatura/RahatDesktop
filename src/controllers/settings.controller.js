const path = require('path');
const { app } = require('electron');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { settingsService } = require('../services');
const config = require('../config/config');

const logsPath = path.join(app.getPath('userData'), '/logs');

const getSettingsPage = async (req, res) => {
  const companyConfig = await settingsService.getCompanyConfig();
  return res.render('pages/settings/settings', {
    page: {
      name: 'settings',
      display: 'Ayarlar',
      menu: 'settings',
      uppermenu: 'settings',
    },
    data: {
      logsPath,
      autoLaunch: await req.app.get('AutoLauncher').isEnabled(),
      cron: config.get('cron'),
      rmq: config.get('rmq'),
      numberBeforeSending: companyConfig.settings.numberBeforeSending,
      nbs: {
        einvoice: companyConfig.settings.nbsDocuments.einvoice.numbering,
        earchive: companyConfig.settings.nbsDocuments.earchive.numbering,
        edespatch: companyConfig.settings.nbsDocuments.edespatch.numbering,
        series: {
          einvoice: config.has('nbsDocuments.einvoice.serie') ? config.get('nbsDocuments.einvoice.serie') : null,
          earchive: config.has('nbsDocuments.earchive.serie') ? config.get('nbsDocuments.earchive.serie') : null,
          edespatch: config.has('nbsDocuments.edespatch.serie') ? config.get('nbsDocuments.edespatch.serie') : null,
        },
      },
    },
  });
};

const getSettingsInvoicePage = (req, res) => {
  return res.render('pages/settings/invoice', {
    page: {
      name: 'settings-invoice',
      display: 'Aktivasyon',
      menu: 'settings-invoice',
      uppermenu: 'settings',
    },
  });
};

const getSettingsDespatchPage = (req, res) => {
  return res.render('pages/settings/despatch', {
    page: {
      name: 'settings-despatch',
      display: 'Aktivasyon',
      menu: 'settings-despatch',
      uppermenu: 'settings',
    },
  });
};

const getSettingsParamsPage = (req, res) => {
  return res.render('pages/settings/params', {
    page: {
      name: 'settings-params',
      display: 'Aktivasyon',
      menu: 'settings-params',
      uppermenu: 'settings',
    },
  });
};

const getInvoiceConfig = catchAsync(async (req, res) => {
  const invoiceConfig = await settingsService.getInvoiceConfig();
  return res.send(invoiceConfig);
});

const getDespatchConfig = catchAsync(async (req, res) => {
  const despatchConfig = await settingsService.getDespatchConfig();
  return res.send(despatchConfig);
});

const getCompanyConfig = catchAsync(async (req, res) => {
  const companyConfig = await settingsService.getCompanyConfig();
  return res.send(companyConfig);
});

const updateInvoiceConfig = catchAsync(async (req, res) => {
  const { queries } = req.body;
  const invoiceConfig = await settingsService.updateInvoiceConfig(queries);
  return res.send(invoiceConfig);
});

const updateDespatchConfig = catchAsync(async (req, res) => {
  const { queries } = req.body;
  const despatchConfig = await settingsService.updateDespatchConfig(queries);
  return res.send(despatchConfig);
});

const updateCompanyConfig = catchAsync(async (req, res) => {
  const { companyConfig } = req.body;
  const updatedCompany = await settingsService.updateCompanyConfig(companyConfig);
  return res.send(updatedCompany);
});

const toggleNumberBeforeSend = catchAsync(async (req, res) => {
  const { status } = req.params;
  const companyConfig = await settingsService.getCompanyConfig();
  companyConfig.settings.numberBeforeSending = status === 'activate';
  await settingsService.updateCompanyConfig(companyConfig);
  return res.send({ success: true });
});

const toggleDocumentNumberBeforeSend = catchAsync(async (req, res) => {
  const { status, docType } = req.params;
  const companyConfig = await settingsService.getCompanyConfig();
  companyConfig.settings.nbsDocuments[docType].numbering = status === 'activate';
  await settingsService.updateCompanyConfig(companyConfig);
  return res.send({ success: true });
});

const updateDocumentSerie = catchAsync(async (req, res) => {
  const { docType, serie } = req.body;
  if (['einvoice', 'earchive', 'edespatch'].indexOf(docType) === -1) {
    return res.status(httpStatus.BAD_REQUEST).send({ success: false });
  }
  config.set(`nbsDocuments.${docType}.serie`, serie);
  return res.send({ success: true });
});

module.exports = {
  getSettingsPage,
  getSettingsInvoicePage,
  getSettingsDespatchPage,
  getSettingsParamsPage,
  getInvoiceConfig,
  getDespatchConfig,
  getCompanyConfig,
  updateInvoiceConfig,
  updateDespatchConfig,
  updateCompanyConfig,
  toggleNumberBeforeSend,
  toggleDocumentNumberBeforeSend,
  updateDocumentSerie,
};
