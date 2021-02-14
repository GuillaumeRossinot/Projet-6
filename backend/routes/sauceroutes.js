const express = require('express'),
 router = express.Router(),
 auth = require('../middleware/auth'),
 multer = require('../middleware/multer-config'),
 sauceCtrl = require('../controllers/saucectrl')

// appel des routes sauces
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;