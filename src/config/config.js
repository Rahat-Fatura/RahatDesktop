const { app } = require('electron');
const path = require('path');
const Config = require('../utils/config');

const configPath = path.join(app.getPath('userData'), 'rahat_desktop.json');
const config = new Config(configPath);

if (!config.get('url')) {
  config.set('url', 'http://localhost:6781/v1');
}
if (!config.get('apikey')) {
  config.set('apikey', '');
}
if (!config.get('port')) {
  config.set('port', '6782');
}

module.exports = config;
