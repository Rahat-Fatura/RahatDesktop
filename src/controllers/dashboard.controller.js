const getDashboardPage = async (req, res) => {
  return res.render('pages/dashboard/dashboard', {
    page: {
      name: 'dashboard',
      display: 'Kontrol Paneli',
      menu: 'dashboard',
      uppermenu: 'dashboard',
    },
  });
};

module.exports = { getDashboardPage };
