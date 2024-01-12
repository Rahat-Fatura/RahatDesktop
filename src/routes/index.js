const express = require('express');

const router = express.Router();

const dashboardRoute = require('./dashboard.route');
const activateRoute = require('./activate.route');

const checkKey = require('../middlewares/checkKey');

router.use('/activate', activateRoute);
router.use('/', checkKey, dashboardRoute);

module.exports = router;
