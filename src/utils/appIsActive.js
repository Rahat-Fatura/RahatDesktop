const config = require('../config/config');

const isAppActive = () => {
  return config.get('isActivated') || false;
};

module.exports = isAppActive;
