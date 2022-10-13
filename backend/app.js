// On place dans ce fichier notre application Express
const express = require('express'); // on importe Express 

const path = require('path');

const app = express(); // constante qui va permettre de créer une application Express

app.use(express.json()); // permet de gérer la requête POST venant de l'application front-end afin d'en extraire le corps JSON.

// Ci-dessous un middelware pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès sont précisés pour tous les objets de réponse.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Utilisation d'une base de données MongoDB grâce à Mongoose -- connexion à la DB
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mohamedEhn:8866482@cluster0.udgsupb.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Pour permettre au frontend d'afficher les fichiers statiques
app.use('/backend/images/', express.static(path.join(__dirname,'images')))

// On enregistre le routeur dans notre fichier app.js
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

//On enregistre ensuite le routeur pour toutes les demandes effectués vers l'api
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

// Ajout de Helmet afin d'améliorer la sécurité contre les vulnérabilités connues (configure des en-têtes http de manière approrié)
const helmet = require("helmet");
app.use(helmet());

module.exports = app; // permet d'accéder à l'application depuis nos autres fichiers du projet (notamment le server)
