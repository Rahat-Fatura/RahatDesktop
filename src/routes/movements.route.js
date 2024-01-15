const express = require('express');
const { movementsController } = require('../controllers');

const router = express.Router();

router.get('/', movementsController.getDocumentsMovementPage);
// router.get('/despatches', movementsController.getDespatchesMovementPage);
router.get('/dt-list', movementsController.getDocumentsList);
// router.get('/despatches/dt-list', movementsController.getDespatchesList);

module.exports = router;
