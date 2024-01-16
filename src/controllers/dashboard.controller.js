const path = require('path');
const { app } = require('electron');
const catchAsync = require('../utils/catchAsync');

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

module.exports = {
  getDashboardPage,
  activateAutoLaunch,
  deactivateAutoLaunch,
};
