const { app } = require('electron');
const path = require('path');
const Config = require('../utils/config');

const configPath = path.join(app.getPath('userData'), 'rahat_desktop.json');
const config = new Config(configPath);

// config.clear();

if (!config.get('url')) {
  config.set('url', 'http://192.168.1.100:6782/v1');
}
if (!config.get('apikey')) {
  config.set('apikey', '');
}
if (!config.get('isActivated')) {
  config.set('isActivated', false);
}
if (!config.get('port')) {
  config.set('port', '6782');
}

if (!config.get('notification')) {
  config.set('notification', { success: false, notify: false, error: true });
}

module.exports = config;
