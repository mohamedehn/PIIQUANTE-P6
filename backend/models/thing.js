//Création d'un schéma de données avec toutes les informations dont nos objets auront besoin
const mongoose = require('mongoose');

// On indique ici le type de données et leur carctère (obligatoire ou non)
const thingSchema = mongoose.Schema({
    sauce : {type : String, required : true},
    file : {type : String, required : true}
});

//on exporte le model correspondant afin de les utiliser et interagir avec la base de données
module.exports = mongoose.model('thing', thingSchema)