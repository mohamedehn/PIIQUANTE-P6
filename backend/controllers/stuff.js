//Dans ce fichier nous allons séparer la logique métier de nos routes en contrôleurs
// Const thing permettra d'accéder au fichier models thing
const thing = require('../models/thing');

// Importation ci-dessous du package fs de node qui onne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');

//Ici, nous exposons la logique de notre route POST en tant que fonction appelée createThing()
exports.createThing = (req, res, next) => {
    const {name, manufacturer, description, mainPepper, heat} = JSON.parse(req.body.sauce); //affectation automatique
    const newThing = new thing({
      userId : req.auth.userId,
      name : name,
      manufacturer : manufacturer,
      description : description,
      mainPepper : mainPepper,
      imageUrl : req.protocol+'://'+req.get('host')+'/backend/images/'+req.file.filename, // permet de récupérer le chemin de l'image enregistrer dans le dossier grâce à multer
      heat : heat,
      likes : 0,
      dislikes : 0,
      usersLiked : [],
      usersDisliked : [],
      //...req.body // permet de récupérer toutes les informations du body de la requête
    })
    newThing.save() 
      .then(()=> res.status(201).json({message : 'Objet crée !'})) //requête réussi
      .catch(error => res.status(400).json({error : 'Mauvaise requête'})) //erreur si problème
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
// on crée un objet thingObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant.
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: req.protocol+'://'+req.get('host')+'/backend/images/'+req.file.filename,
    } : { ...req.body };
  
    delete thingObject._userId;
    thing.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

// Ci-dessous le endpoint DELETE qui va permettre de supprimer une sauce avec l'id fourni
exports.deleteThing = (req, res, next) => {
  thing.findOne({ _id: req.params.id})
  .then(thing => {
      if (thing.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = thing.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { // unlink permet de supprimer le fichier de la DB
              thing.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
}

// Ci-dessous le endpoints qui va permettre de liker ou disliker une sauce
exports.likes = (req, res, next) => {
  thing.findOne({ _id: req.params.id })
  .then(sauce => {
      // Si l'utilisateur n'as pas encore liker ou disliker la sauce concerné.
      if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
          if(req.body.like == 1) { // L'utilisateur aime la sauce
              sauce.usersLiked.push(req.body.userId);
              sauce.likes += req.body.like;
          } else if(req.body.like == -1) { // L'utilisateur n'aime pas la sauce
              sauce.usersDisliked.push(req.body.userId);
              sauce.dislikes -= req.body.like;
          };
      };
      // Si l'utilisateur veut annuler son "like"
      if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
          const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
          sauce.usersLiked.splice(likesUserIndex, 1);
          sauce.likes -= 1;
      };
      // Si l'utilisateur veut annuler son "dislike"
      if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
          const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
          sauce.usersDisliked.splice(likesUserIndex, 1);
          sauce.dislikes -= 1;
      }
      sauce.save();
      res.status(201).json({ message: 'Mise à jour des likes' });
  })
  .catch(error => res.status(500).json({ error }));
}