//Dans ce fichier nous allons séparer la logique métier de nos routes en contrôleurs
const thing = require('../models/thing');

//Ici, nous exposons la logique de notre route POST en tant que fonction appelée createThing()
exports.createThing = (req, res, next) => {
    const thing = new thing({
      ...req.body // permet de récupérer toutes les informations du body de la requête
    })
    thing.save()
      .then(()=> res.status(201).json({message : 'Objet crée !'})) //requête réussi
      .catch(error => res.status(400).json({error})) //erreur si problème
};

//Dans ce middleware, nous implémentons notre route get afin de récupérer tout les "thing" depuis la base de données. Find permet de renvoyer un tableau
exports.getAllStuff = (req, res, next) => {
    thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
};

// Ci-dessous le endpoints GET afin de récupérer un thing en particulier et non la totalité. Mise en place d'un paramètre dynamique grâce à :id
exports.getOneThing = (req, res, next) => {
    thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));  
};

// Ci-dessous le endpoint PUT qui va permettre de modifier une sauce avec l'id fourni (d'ou le updateOne avec l'id passé en paramètre)
exports.modifyThing = (req, res, next) => {
    const thing = new thing({
        ...req.body // permet de récupérer toutes les informations du body de la requête
      })
    thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
}

// Ci-dessous le endpoint DELETE qui va permettre de supprimer une sauce avec l'id fourni
exports.deleteThing = (req, res, next) => {
    thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
}