const { app, BrowserWindow, shell } = require('electron');
const AutoLaunch = require('auto-launch');
const consumers = require('./rmq.consumers');
const cronInit = require('./cron');

const electronConfig = require('../electron');

const appAutoLauncher = new AutoLaunch({
  name: 'Rahat Desktop',
  path: app.getPath('exe'),
});

const initialize = (expressApp) => {
  let mainWindow;
  expressApp.set('AutoLauncher', appAutoLauncher);
  app.setName('RahatDesktop');
  app.whenReady().then(async () => {
    mainWindow = electronConfig.createWindow();
    electronConfig.createTray(mainWindow);
    electronConfig.createMenu(mainWindow);
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        electronConfig.createWindow();
      }
    });
    electronConfig.ipcListeners(mainWindow);
    cronInit(expressApp);
    consumers.consumeTunnel(expressApp);
  });
  app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
  });
};

module.exports = {
  initialize,
};
