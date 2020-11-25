
// importing all the necessary libraries
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const bcrypt = require ('bcrypt');

// making the reset password controller
const resetTokenController = (req, res) => {
    try {

        // make a variable to hold the user document if found successfully
        let founduser = undefined;

        // If no reset token in present in the query parameters then throw error
        if (!req.params.reset_token || !req.body.newpassword) {
            throw new Error ('No reset token or new password is in present in the request to reset the password');
        }

        // getting the reset token from the query parameters and new password from request body
        const reset_token = req.params.reset_token;
        const { newpassword } = _.pick (req.body, ['newpassword']);

        // Check if the password is valid or not
        if (!validatePassword (newpassword)) {
            throw new Error ('the new password you have passed is not a valid password');
        }

        // decoding the reset token we got from the query parameters
        const decodedtoken = jwt.verify (reset_token, config.ResetPasswordSecret);

        // finding the User having the decoded token specified id abd the given reset token
        // this will make reset_token to be used only once

        User.findOne ({
            _id: decodedtoken._id,
            reset_token
        }).then ((foundUser) => {
            
            // If no user is found then throw error
            if (!foundUser) {
                throw new Error ('no user found with that reset token');
            }

            founduser = foundUser;
            // return bcrypt promise to make a new password hash
            return bcrypt.hash (newpassword, config.saltRounds);

        }).then ((hashedpassword) => {

            // If password hashed successfully then return a promise to update the user's password with the hashed password
            return User.findOneAndUpdate ({
                _id: founduser._id
            }, {
                $set: {
                    password: hashedpassword,
                    reset_token: ''
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query' });

        }).then ((updatedUser) => {

            // In case of success return updated User
            return res.status (200).send ({
                status: 'success',
                updatedUser
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
    resetTokenController
}