//Dans ce fichier nous allons séparer la logique métier de nos routes en contrôleurs
// Const sauce permettra d'accéder au fichier models sauce
const Sauce = require('../models/sauce');

// Importation ci-dessous du package fs de node qui onne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');

// Fonction afin de vérifier que l'utilisateur est authentifié
function verifyUser(req, sauce){
    if (sauce.userId != req.auth.userId) { // Permet de vérifier si c'est le propriétaire de la sauce qui effectue la mise à jour
        return false
    }else{
        return true
    }
}

//Ici, nous exposons la logique de notre route POST en tant que fonction appelée createSauce()
exports.createSauce = (req, res, next) => {
    const {name, manufacturer, description, mainPepper, heat} = JSON.parse(req.body.sauce); //affectation automatique
    const newSauce = new Sauce({
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
    newSauce.save() 
      .then(()=> res.status(201).json({message : 'Objet crée !'})) //requête réussi
      .catch(error => res.status(400).json({error : 'Mauvaise requête'})) //erreur si problème
};

//Dans ce middleware, nous implémentons notre route get afin de récupérer tout les "sauce" depuis la base de données. Find permet de renvoyer un tableau
exports.getAllStuff = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// Ci-dessous le endpoints GET afin de récupérer un sauce en particulier et non la totalité. Mise en place d'un paramètre dynamique grâce à :id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));  
};

// Ci-dessous le endpoint PUT qui va permettre de modifier une sauce avec l'id fourni (d'ou le updateOne avec l'id passé en paramètre)
// on crée un objet sauceObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: req.protocol+'://'+req.get('host')+'/backend/images/'+req.file.filename,
    } : { ...req.body };
    
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (!verifyUser(req, sauce)) return res.status(401).json({ message : 'Not authorized'});
            if (req.file){
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {}); // unlink permet de supprimer le fichier de la DB
            }
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

// Ci-dessous le endpoint DELETE qui va permettre de supprimer une sauce avec l'id fourni
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
    if (!verifyUser(req, sauce)) return res.status(401).json({ message : 'Not authorized'});
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => { // unlink permet de supprimer le fichier de la DB
    sauce.deleteOne({_id: req.params.id})
        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
        .catch(error => res.status(401).json({ error }));
    });
})
  .catch( error => {
      res.status(500).json({ error });
  });
}

// Ci-dessous le endpoints qui va permettre de liker ou disliker une sauce
exports.likes = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
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