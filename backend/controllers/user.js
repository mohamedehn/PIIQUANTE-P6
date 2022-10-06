// on importe le package de bcrypt
const bcrypt = require('bcrypt')

//on importe le package de jsonwebtoken
const jsonwebtoken = require('jsonwebtoken');

// on appelle (require) notre models user
const user = require('../models/user')

// Ci-dessous middleware permettant de se connecter (login) et de s'enregistrer(signup) sur le site
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //ici fonction asynchrone afin de hacher notre mot de passe
        .then(hash => {
            const user = new user({
                email : req.body.email,
                password : hash
            });
            user.save()
                .then(()=> res.status(201).json({message : 'Utilisateur créé !'}))
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    user.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }else{
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }else{
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        {userId : user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn : '24h'}
                    )
                })};
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};