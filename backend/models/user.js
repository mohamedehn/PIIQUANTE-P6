//Création d'un schéma de données avec toutes les informations dont nos objets auront besoin
const mongoose = require('mongoose');

// installation d'un plugin afin de s'assurer que chaque utilisateur ai une adresse mail unique 
const uniqueValidator = require('mongoose-unique-validator');

// On indique ici le type de données et leur carctère (obligatoire ou non)
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true}, // unique empêcher les utilisateurs de s'inscrire plusieurs fois avec la même adresse mail
    password : {type : String, required : true}
});

// permet d'utiliser le plugin validator de mongoose
userSchema.plugin(uniqueValidator);

//on exporte le model correspondant afin de les utiliser et interagir avec la base de données
module.exports = mongoose.model('user', userSchema)