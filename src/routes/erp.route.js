const express = require('express');
const { erpController } = require('../controllers');

const router = express.Router();

router.get('/invoices', erpController.getERPInvoicesPage);
router.get('/invoice/send/:exId', erpController.sendInvoice);
router.get('/despatches', erpController.getERPDespatchesPage);
router.get('/despatch/send/:exId', erpController.sendDespatch);

module.exports = router;
