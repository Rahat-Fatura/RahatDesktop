const express = require('express');
const { dashboardController } = require('../controllers');

const router = express.Router();

router.get('/', dashboardController.getDashboardPage);
router.post('/auto-launch/activate', dashboardController.activateAutoLaunch);
router.post('/auto-launch/deactivate', dashboardController.deactivateAutoLaunch);
router.post('/cron/activate', dashboardController.activateCron);
router.post('/cron/deactivate', dashboardController.deactivateCron);
router.post('/rmq/activate', dashboardController.activateRMQ);
router.post('/rmq/deactivate', dashboardController.deactivateRMQ);

module.exports = router;
