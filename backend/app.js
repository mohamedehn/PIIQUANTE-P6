// On place dans ce fichier notre application Express

const express = require('express'); // on importe Express 

const app = express(); // constante qui va permettre de créer une application Express

module.exports = app; // permet d'accéder à l'application depuis nos autres fichiers du projet (notamment le server)

app.use ((req, res, next)=>{ // Middleware : Afin de répondre à la requête qui émise par le serveur vers l'application. Permet de récupérer un objet au format JSON.Sans cette réponse, POSTMAN nous renvoi une erreur 404 lors de la requête GET
    res.json({message : 'Votre requête a bien été reçu'})
    next() // Next permet de terminer la requête et passé au middleware suivant 
})

