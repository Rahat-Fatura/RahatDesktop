const httpStatus = require('http-status');
const queryHelper = require('../helpers/query.helper');
const catchAsync = require('../utils/catchAsync');
const { documentService } = require('../services');
const ApiError = require('../utils/ApiError');

const getERPInvoicesPage = catchAsync(async (req, res) => {
  const invoices = await queryHelper.runCheckUnsendedInvoiceQuery();
  return res.render('pages/erp/invoices', {
    page: {
      name: 'erp-invoices',
      display: 'ERP Fatura Listesi',
      menu: 'erp-invoices',
      uppermenu: 'erp',
    },
    data: {
      invoices: invoices || [],
    },
  });
});

const sendInvoice = catchAsync(async (req, res) => {
  const { exId } = req.params;
  const send = await documentService.upsertDocument(exId, 'manual', 'invoice');
  if (!send.success) {
    throw new ApiError(httpStatus.BAD_REQUEST, send.error.message);
  }
  res.send({ success: true });
});

const getERPDespatchesPage = catchAsync(async (req, res) => {
  const despatches = await queryHelper.runCheckUnsendedDespatchQuery();
  return res.render('pages/erp/despatches', {
    page: {
      name: 'erp-despatches',
      display: 'ERP İrsaliye Listesi',
      menu: 'erp-despatches',
      uppermenu: 'erp',
    },
    data: {
      despatches: despatches || [],
    },
  });
});

const sendDespatch = catchAsync(async (req, res) => {
  const { exId } = req.params;
  const send = await documentService.upsertDocument(exId, 'manual', 'despatch');
  if (!send.success) {
    throw new ApiError(httpStatus.BAD_REQUEST, send.error.message);
  }
  res.send({ success: true });
});

module.exports = {
  getERPInvoicesPage,
  sendInvoice,
  getERPDespatchesPage,
  sendDespatch,
};
