const express = require('express');
const { dashboardController } = require('../controllers');

const router = express.Router();

router.get('/', dashboardController.getDashboardPage);
router.post('/auto-launch/activate', dashboardController.activateAutoLaunch);
router.post('/auto-launch/deactivate', dashboardController.deactivateAutoLaunch);

module.exports = router;
