const express = require('express');
const { activateController } = require('../controllers');

const router = express.Router();

router.get('/', activateController.getActivatePage).post('/', activateController.activateKey);

module.exports = router;
