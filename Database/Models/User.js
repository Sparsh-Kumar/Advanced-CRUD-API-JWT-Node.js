

// importing all the requirements
const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const path = require ('path');
const bcrypt = require ('bcrypt');
const { config } = require (path.resolve (__dirname, '..', '..', 'appConfig', 'config'));
const { validateEmail, validatePassword, validateUsername } = require (path.resolve (__dirname, '..', '..', 'validators', 'validator'));

// Defining the User Schema
const UserSchema = new mongoose.Schema ({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: (username) => {
                return validateUsername (username);
            },
            message: '{VALUE} is not a valid username'
        }
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: (email) => {
                return validateEmail (email);
            },
            message: '{VALUE} is not a valid email'
        }
    },

    password: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: (password) => {
                return validatePassword (password);
            },
            message: '{VALUE} is not a valid password'
        }
    },

    refresh_token: {
        type: String,
        default: ''
    },

    reset_token: {
        type: String,
        default: ''
    },

    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'article'
        }
    ]

}, { timestamps: true });

UserSchema.plugin (uniqueValidator);

// Defining the function that needs to get executed before insertion of any document
// Always remember to make use of ES-5 function syntax in defining statics and method functions in schema
// because ES-6 functions cannot work with `this` keyword and arguments array, but these can be our requirements

UserSchema.pre ('save', function (next) {
    let user = this; // the current document that needs to be inserted
    bcrypt.hash (user.password, config.saltRounds, (error, hash) => {
        if (error) {
            return next (error);
        }
        else {
            user.password = hash;
            next ();
        }
    })
})


// Defining the comparePassword static function
// this will check for correct password

UserSchema.statics.comparePassword = function (plainTextpassword, hashedPassword) {
    return bcrypt.compare (plainTextpassword, hashedPassword) // it returns a promise
}

const User = mongoose.model ('user', UserSchema);

// exporting the User Model
module.exports = {
    User
}
