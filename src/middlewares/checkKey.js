const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

module.exports = catchAsync(async (req, res, next) => {
  const key = config.get('apikey');
  if (!key) {
    return res.redirect('/activate');
  }
  if (!config.get('isActivated')) {
    return res.redirect('/activate/setup');
  }
  return next();
});
