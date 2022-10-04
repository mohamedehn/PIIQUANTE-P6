// On place dans ce fichier notre application Express

const express = require('express'); // on importe Express 

const app = express(); // constante qui va permettre de créer une application Express

app.use(express.json()); // permet de gérer la requête POST venant de l'application front-end afin d'en extraire le corps JSON. 

module.exports = app; // permet d'accéder à l'application depuis nos autres fichiers du projet (notamment le server)

/*app.use ((req, res, next)=>{ // Middleware : Afin de répondre à la requête qui émise par le serveur vers l'application. Permet de récupérer un objet au format JSON. Sans cette réponse, POSTMAN nous renvoi une erreur 404 lors de la requête GET
    res.json({message : 'Votre requête a bien été reçu'})
    next() // Next permet de terminer la requête et passé au middleware suivant 
})
*/

//Utilisation d'une base de données MongoDB grâce à Mongoose -- connexion à la DB
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mohamedEhn:8866482@cluster0.udgsupb.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Ci-dessous un middelware pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès sont précisés pour tous les objets de réponse.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//------ Ci-dessous nous aurons les routes pour la création de compte-----
//Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
app.post('/api/auth/signup', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
  });

//Dans ce middleware, nous créons un groupe d'articles avec le schéma de données spécifique requis par le front-end. Nous envoyons ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.
app.get('/api/auth/signup', (req, res, next) => {
    const signup = [
      {
        email: '',
        password: '',
      },
    ];
    res.status(200).json(signup);
    next()
  });

//------ Ci-dessous nous aurons les routes pour la connexion-----
app.post('/api/auth/login', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        userId: '',
        token: ''
    });
});

app.get('/api/auth/login', (req, res, next) => {
    const login = [
      {
        email: '',
        password: '',
      },
    ];
    res.status(200).json(login);
    next()
  });