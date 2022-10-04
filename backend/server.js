const http = require('http');
const app = require ('./app') // importer le fichier app.js sur le fichier serveur.js

app.set('port',process.env.PORT || 3000 ) // Permet de dire à l'application express sur quel port du serveur elle va tourner et la déployer

const server = http.createServer(app); // appelle de la fonction app, pour appeler l'application dans la serveur

server.listen(process.env.PORT || 3000); // permet d'écouter (déployer) le serveur surle port 300

/*
// Utilisation de mongoose (Mongo DB) sur le projet

const mongoose = require ('mongoose')

// Nous précisons sur quel DB nous allons travailler

mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

// Permet de se déconnecter de MongoDB

mongoose.connection.close();

*/