const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const SauceCtrl = require('../controllers/saucectrl');

// appel des routes sauces
router.get('/', auth, SauceCtrl.getAllSauce);
router.get('/:id', auth, SauceCtrl.getOneSauce);
router.delete('/:id', auth, SauceCtrl.deleteSauce);
router.post('/', auth, SauceCtrl.createSauce);


module.exports = router;