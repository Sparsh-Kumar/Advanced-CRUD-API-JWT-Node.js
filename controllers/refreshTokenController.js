
// importing all the necessary libraries
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const bcrypt = require ('bcrypt');


// Defining the refreshToken Controller
const refreshTokenController = (req, res) => {
    try {
        if (!req.params.refresh_token) {
            throw new Error ('no refresh token present in the request');
        }
        
        let new_auth_token = undefined;
        let new_refresh_token = undefined;

        // get refresh token value and decode it
        const refresh_token = req.params.refresh_token;
        const decodedrefreshtoken = jwt.verify (refresh_token, config.RefreshTokenSecret);
        
        // find the user with the given id of refresh token
        // and it should also have that refresh token in its refresh_token field
        // this will make the refresh_token to be used only once
        
        User.findOne ({
            _id: decodedrefreshtoken._id,
            refresh_token
        }).then ((foundUser) => {
            if (!foundUser) {
                throw new Error ('no user found with the associated refresh token');
            }

            // if user is found with the associated refresh token then generate new auth token and refresh token
            new_auth_token = jwt.sign ({ _id: foundUser._id }, config.SignInSecret, { expiresIn: 60 });
            new_refresh_token = jwt.sign ({ _id: foundUser._id }, config.RefreshTokenSecret);

            // return a promise to update the user with the new refresh token
            return User.findOneAndUpdate ({
                _id: foundUser._id 
            }, {
                $set: {
                    refresh_token: new_refresh_token
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query'});

        }).then((updatedUser) => {
            return res.status (200).send ({
                status: 'success',
                updatedUser,
                new_auth_token,
                new_refresh_token
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
    refreshTokenController
}