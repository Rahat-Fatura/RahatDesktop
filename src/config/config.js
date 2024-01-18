const { app } = require('electron');
const path = require('path');
const Config = require('../utils/config');

const configPath = path.join(app.getPath('userData'), 'rahat_desktop.json');
const config = new Config(configPath);

// config.clear();

if (!config.has('url')) {
  config.set('url', 'https://localservice.rahatsistem.com.tr/v1');
}
if (!config.has('apikey')) {
  config.set('apikey', '');
}
if (!config.has('isActivated')) {
  config.set('isActivated', false);
}
if (!config.has('port')) {
  config.set('port', '6782');
}
if (!config.has('notification')) {
  config.set('notification', { success: false, notify: false, error: true });
}
if (!config.has('cron')) {
  config.set('cron', false);
}
if (!config.has('rmq')) {
  config.set('rmq', true);
}

module.exports = config;
