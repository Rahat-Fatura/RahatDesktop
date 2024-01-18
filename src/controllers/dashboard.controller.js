const path = require('path');
const { app } = require('electron');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const getDashboardPage = async (req, res) => {
  const logsPath = path.join(app.getPath('userData'), '/logs');
  return res.render('pages/dashboard/dashboard', {
    page: {
      name: 'dashboard',
      display: 'Kontrol Paneli',
      menu: 'dashboard',
      uppermenu: 'dashboard',
    },
    data: {
      logsPath,
      autoLaunch: await req.app.get('AutoLauncher').isEnabled(),
    },
  });
};

const activateAutoLaunch = catchAsync(async (req, res) => {
  const AutoLauncher = req.app.get('AutoLauncher');
  await AutoLauncher.enable();
  return res.json({ success: true });
});

const deactivateAutoLaunch = catchAsync(async (req, res) => {
  const AutoLauncher = req.app.get('AutoLauncher');
  await AutoLauncher.disable();
  return res.json({ success: true });
});

const activateCron = catchAsync(async (req, res) => {
  config.set('cron', true);
  return res.json({ success: true });
});

const deactivateCron = catchAsync(async (req, res) => {
  config.set('cron', false);
  return res.json({ success: true });
});

const activateRMQ = catchAsync(async (req, res) => {
  config.set('rmq', true);
  return res.json({ success: true });
});

const deactivateRMQ = catchAsync(async (req, res) => {
  config.set('rmq', false);
  return res.json({ success: true });
});

module.exports = {
  getDashboardPage,
  activateAutoLaunch,
  deactivateAutoLaunch,
  activateCron,
  deactivateCron,
  activateRMQ,
  deactivateRMQ,
};
