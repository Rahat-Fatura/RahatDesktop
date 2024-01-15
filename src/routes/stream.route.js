const express = require('express');
const { streamController } = require('../controllers');

const router = express.Router();

router.get('/invoice/insert/:exId', streamController.insertInvoice);
router.get('/invoice/update', streamController.updateInvoice);
router.get('/invoice/delete', streamController.deleteInvoice);

// router.get('/despath/insert', streamController.insertDespath);
// router.get('/despath/update', streamController.updateDespath);
// router.get('/despath/delete', streamController.deleteDespath);

module.exports = router;
