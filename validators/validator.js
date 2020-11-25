
// importing all the validator libraries
const validator = require ('validator');
const passwordValidator = require ('password-validator');

// defining the password schema
const passwordSchema = new passwordValidator ();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
const jwt = require ('jsonwebtoken');


// email validation function
const validateEmail = (email) => {
    return validator.isEmail (email);
}

// username validation function
const validateUsername = (username) => {
    return ((!validator.isEmpty (username)) && (validator.isAlphanumeric (username)));
}

// password validation function
const validatePassword = (password) => {
    return passwordSchema.validate (password);
}

// title validation function
const validateTitle = (title) => {

    //Regular Expression to check if a field input contains letters and numbers only
    let isAlphanumeric = /^[0-9a-zA-Z ]+$/;
    return (title.length && isAlphanumeric.test (title));

}

// description validation function
const validateDescription = (description) => {
    
    //Regular Expression to check if a field input contains letters and numbers only
    let isAlphanumeric = /^[0-9a-zA-Z ]+$/;
    return (description.length && isAlphanumeric.test (description));
    
}

// exporting all the functions
module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
    validateTitle,
    validateDescription
}