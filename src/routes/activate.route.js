const express = require('express');
const { activateController } = require('../controllers');

const router = express.Router();

router.get('/', activateController.getActivatePage).post('/', activateController.activateKey);
router.get('/setup', activateController.getSetupPage).post('/setup', activateController.completeSetup);

router.post('/check/mssql', activateController.checkMSSQLString);
router.get('/erp-apps', activateController.getERPApps);
router.get('/erp-apps/:id', activateController.getAppVariables);

module.exports = router;
