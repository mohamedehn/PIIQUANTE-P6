//création d'un routeur express afin de stocker nos routes ici au lieu de notre fichier app.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

//Pour réimplémenter cela dans notre route, nous devons importer notre contrôleur puis enregistrer chaque fonction
const stuffCtrl = require('../controllers/stuff');

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;

/*
//------ Ci-dessous nous aurons les routes pour la création/modifcations/supprimer de nouvelles sauces-----
//Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
router.post('/', stuffCtrl.createThing);

//Dans ce middleware, nous implémentons notre route get afin de récupérer tout les "thing" depuis la base de données. Find permet de renvoyer un tableau
router.get('/', stuffCtrl.getAllStuff);
  
// Ci-dessous le endpoints GET afin de récupérer un thing en particulier et non la totalité. Mise en place d'un paramètre dynamique grâce à :id
router.get('/:id', stuffCtrl.getOneThing);
  
// Ci-dessous le endpoint PUT qui va permettre de modifier une sauce avec l'id fourni (d'ou le updateOne avec l'id passé en paramètre)
router.put('/:id', stuffCtrl.modifyThing);
  
// Ci-dessous le endpoint DELETE qui va permettre de supprimer une sauce avec l'id fourni
router.delete('/:id', stuffCtrl.deleteThing);  
*/


