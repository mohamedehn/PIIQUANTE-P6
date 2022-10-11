//création d'un routeur express afin de stocker nos routes ici au lieu de notre fichier app.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

//Pour réimplémenter cela dans notre route, nous devons importer notre contrôleur puis enregistrer chaque fonction
const stuffCtrl = require('../controllers/stuff');

//--Ci-dessous nous aurons les routes pour la création/modifcations/supprimer de nouvelles sauces, on intègre le auth pour autoriser l'utilisateur et multer pour la possibilier d'ajouter, modifier ou supprimer une image sur une sauce--
router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.post('/:id/like', auth, stuffCtrl.likes)

module.exports = router;



