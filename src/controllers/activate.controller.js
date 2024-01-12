const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { backendService } = require('../services');

const getActivatePage = (req, res) => {
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
  const checked = await backendService.graphql.getCompany(key);
  console.log(checked);
  return res.send(checked);
});

module.exports = { getActivatePage, activateKey };
