// importation de password validator
const passwordValidator = require('password-validator');

// Create a schema
const passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(15)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123']); // Blacklist these values

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }else{
        return res.status(400).json({message:"Le mot de passe doit contenir entre 8 et 15 caractères, au moins 1 majuscule et 1 miniscule ainsi que 2 chiffres"});
    }
}