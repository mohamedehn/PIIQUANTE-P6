// on importe express et on créer un router que l'on va à la fin exporter vers app.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// importation du middleware de password validator
const password = require('../middleware/password');

//Création de deux routes login et signup au travers du router

router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;