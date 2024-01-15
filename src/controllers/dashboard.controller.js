const path = require('path');
const { app } = require('electron');

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
    },
  });
};

module.exports = { getDashboardPage };
