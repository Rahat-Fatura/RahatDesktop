const path = require('path');
const { app } = require('electron');
const catchAsync = require('../utils/catchAsync');
const { settingsService } = require('../services');
const config = require('../config/config');

const logsPath = path.join(app.getPath('userData'), '/logs');

const getSettingsPage = async (req, res) => {
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
};
