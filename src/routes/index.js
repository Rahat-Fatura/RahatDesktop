const express = require('express');

const router = express.Router();

const dashboardRoute = require('./dashboard.route');
const activateRoute = require('./activate.route');
const settingsRoute = require('./settings.route');
const streamRoute = require('./stream.route');
const movementsRoute = require('./movements.route');
const erpRoute = require('./erp.route');

const checkKey = require('../middlewares/checkKey');

router.use('/activate', activateRoute);
router.use('/stream', streamRoute);
router.use('/settings', checkKey, settingsRoute);
router.use('/movements', checkKey, movementsRoute);
router.use('/erp', checkKey, erpRoute);
router.use('/', checkKey, dashboardRoute);

module.exports = router;
