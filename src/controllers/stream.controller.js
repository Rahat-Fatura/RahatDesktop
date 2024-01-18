const catchAsync = require('../utils/catchAsync');
const { documentService } = require('../services');

const insertInvoice = catchAsync(async (req, res) => {
  res.send(true);
  const { exId } = req.params;
  await documentService.upsertDocument(exId, 'insert', 'invoice');
});

const updateInvoice = catchAsync(async (req, res) => {
  res.send(true);
  const { exId } = req.params;
  await documentService.upsertDocument(exId, 'update', 'invoice');
});

const deleteInvoice = catchAsync(async (req, res) => {
  res.send(true);
  const { exId } = req.params;
  await documentService.deleteDocument(exId, 'invoice');
});

const insertDespatch = catchAsync(async (req, res) => {
  res.send(true);
  const { exId } = req.params;
  await documentService.upsertDocument(exId, 'insert', 'despatch');
});

const updateDespatch = catchAsync(async (req, res) => {
  res.send(true);
  const { exId } = req.params;
  await documentService.upsertDocument(exId, 'update', 'despatch');
});

const deleteDespatch = catchAsync(async (req, res) => {
  res.send(true);
  const { exId } = req.params;
  await documentService.upsertDocument(exId, 'despatch');
});

module.exports = {
  insertInvoice,
  updateInvoice,
  deleteInvoice,
  insertDespatch,
  updateDespatch,
  deleteDespatch,
};
