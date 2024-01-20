const express = require('express');
const { settingsController } = require('../controllers');

const router = express.Router();

router.get('/', settingsController.getSettingsPage);
router.get('/invoice', settingsController.getSettingsInvoicePage);
router.get('/despatch', settingsController.getSettingsDespatchPage);
router.get('/params', settingsController.getSettingsParamsPage);

router
  .get('/config/invoice', settingsController.getInvoiceConfig)
  .post('/config/invoice', settingsController.updateInvoiceConfig);
router
  .get('/config/despatch', settingsController.getDespatchConfig)
  .post('/config/despatch', settingsController.updateDespatchConfig);
router
  .get('/config/company', settingsController.getCompanyConfig)
  .post('/config/company', settingsController.updateCompanyConfig);

router.put('/general.nbs/:status', settingsController.toggleNumberBeforeSend);
router.put('/document.nbs/document/serie', settingsController.updateDocumentSerie);
router.put('/document.nbs/:docType/:status', settingsController.toggleDocumentNumberBeforeSend);

module.exports = router;
