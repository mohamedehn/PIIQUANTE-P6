//Création d'un schéma de données avec toutes les informations dont nos objets auront besoin
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');


// On indique ici le type de données et leur carctère (obligatoire ou non)
const thingSchema = mongoose.Schema({
    userId : {type : String, required : true},
    name : {type : String, required : true},
    manufacturer : {type : String, required : true},
    description : {type : String, required : true},
    mainPepper : {type : String, required : true},
    imageUrl : {type : String, required : true},
    heat : {type : Number, required : true},
    likes : {type : Number, required : true},
    dislikes : {type : Number, required : true},
    usersLiked : {type : Array, required : true},
    usersDisliked : {type : Array, required : true},
});

thingSchema.plugin(mongodbErrorHandler); // permet de mieux formater/interpréter les erreurs au niveau de la BD

//on exporte le model correspondant afin de les utiliser et interagir avec la base de données
module.exports = mongoose.model('thing', thingSchema)