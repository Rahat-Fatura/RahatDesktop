const express = require('express');
const { streamController } = require('../controllers');

const router = express.Router();

router.get('/invoice/insert/:exId', streamController.insertInvoice);
router.get('/invoice/update/:exId', streamController.updateInvoice);
router.get('/invoice/delete/:exId', streamController.deleteInvoice);

router.get('/despatch/insert/:exId', streamController.insertDespatch);
router.get('/despatch/update/:exId', streamController.updateDespatch);
router.get('/despatch/delete/:exId', streamController.deleteDespatch);

module.exports = router;
