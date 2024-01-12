const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  const key = req.app.get('config').get('apikey');
  if (!key) {
    return res.redirect('/activate');
  }
  return next();
});
