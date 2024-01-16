const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { activateService } = require('../services');
const isAppActive = require('../utils/appIsActive');

const getActivatePage = (req, res) => {
  const key = config.get('apikey');
  const isActivated = isAppActive();
  if (key && !isActivated) return res.redirect('/activate/setup');
  if (key && isActivated) return res.redirect('/');
  return res.render('pages/activate/activate', {
    page: {
      name: 'activate',
      display: 'Aktivasyon',
      menu: 'activate',
      uppermenu: '',
    },
  });
};

const activateKey = catchAsync(async (req, res) => {
  const { key } = req.body;
  const checked = await activateService.checkKey(key);
  config.set('apikey', key);
  if (checked.id) config.set('isActivated', true);
  else config.set('isActivated', false);
  return res.send({ id: checked.id, isActivated: isAppActive() });
});

const getSetupPage = (req, res) => {
  return res.render('pages/activate/setup', {
    page: {
      name: 'setup',
      display: 'Kurulum',
      menu: 'setup',
      uppermenu: '',
    },
  });
};

const checkMSSQLString = catchAsync(async (req, res) => {
  const { mssqlString } = req.body;
  await activateService.checkMSSQLString(mssqlString);
  return res.send({ success: true });
});

const getERPApps = catchAsync(async (req, res) => {
  const erpApps = await activateService.getERPApps();
  return res.send(erpApps);
});

const getAppVariables = catchAsync(async (req, res) => {
  const { id } = req.params;
  const appVariables = await activateService.getAppVariables(id);
  return res.send(appVariables);
});

const completeSetup = catchAsync(async (req, res) => {
  const { mssqlString, erpAppId, variables } = req.body;
  await activateService.completeSetup(mssqlString, erpAppId, variables, config.get('apikey'));
  config.set('isActivated', true);
  return res.send({ success: true });
});

module.exports = {
  getActivatePage,
  activateKey,
  getSetupPage,
  checkMSSQLString,
  getERPApps,
  getAppVariables,
  completeSetup,
};
