//Création d'un schéma de données avec toutes les informations dont nos objets auront besoin
const mongoose = require('mongoose');

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
    usersLiked : {type : ["String <userId>"], required : true},
    usersDisliked : {type : ["String <userId>"], required : true},
    sauce : {type : String, required : true},
    file : {type : String, required : true},
});

//on exporte le model correspondant afin de les utiliser et interagir avec la base de données
module.exports = mongoose.model('thing', thingSchema)