const { backendService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getDocumentsMovementPage = async (req, res) => {
  return res.render('pages/movements/movements', {
    page: {
      name: 'movements',
      display: 'Belgeler',
      menu: 'movements',
      uppermenu: 'movements',
    },
  });
};

const getDocumentsList = catchAsync(async (req, res) => {
  const { query } = req;
  const docs = await backendService.documents.getDocumentsList(query);
  return res.json(docs);
});

module.exports = {
  getDocumentsMovementPage,
  getDocumentsList,
};
