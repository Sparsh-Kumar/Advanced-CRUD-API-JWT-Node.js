
// importing all the necessary libraries
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const bcrypt = require ('bcrypt');

// Defining the registration controller
const registerController = (req, res) => {
    try {
        // throwing the error if nor registration token is present
        if (!req.params.regtoken) {
            throw new Error ('no registration token present in the request');
        }

        // taking the token and verifying it 
        const token = req.params.regtoken;
        const decodedToken = jwt.verify (token, config.SignUpSecret);
        const { username, email, password } = _.pick (decodedToken, ['username', 'email', 'password']);

        // finding if someone has created the account with same username or email address
        User.findOne ({
            $or: [
                { username },
                { email }
            ]
        }).then ((foundDoc) => {
            if (foundDoc) {
                throw new Error ('account with this username or email already exists')
            }
            
            // proceed furthur
            return User.create ({
                username,
                email,
                password
            })
        }).then ((createdUser) => {
            return res.status (200).send ({
                status: 'success',
                createdUser
            })
        }).catch ((error) => {
            return res.status (401).send ({
                status: 'failure',
                message: error.message
            })
        })
    }
    catch (error) {
        return res.status (401).send ({
            status: 'failure',
            message: error.message
        })
    }
}


// exporting the controller
module.exports = {
    registerController
}