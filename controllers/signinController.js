
// importing all the necessary libraries
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const bcrypt = require ('bcrypt');

// Defining the login controller
const signinController = (req, res) => {
    
    let auth_token = undefined;
    let refresh_token = undefined;
    let founduser = undefined;

    try {
        if (!req.body.email || !req.body.password) {
            throw new Error ('email or password are not sent for login');
        }
        const { email, password } = _.pick (req.body, ['email', 'password']);

        // try to find user with the specified email and password
        User.findOne ({
            email
        }).then ((foundUser) => {
            if (!foundUser) {
                throw new Error ('User with the given email and password not present');
            }

            founduser = foundUser;
            return User.comparePassword (password, foundUser.password);

        }).then ((result) => {

            // checking if the password is incorrect
            if (result === false) {
                throw new Error ('password validation failed, you have entered a wrong password');
            }

            // making the authentication token and refresh token
            auth_token = jwt.sign ({ _id: founduser._id }, config.SignInSecret, { expiresIn: 60 });
            refresh_token = jwt.sign ({ _id: founduser._id }, config.RefreshTokenSecret);

            // returning a promise to update a user
            return User.findOneAndUpdate ({
                _id: founduser._id
            }, {
                $set: {
                    refresh_token
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query'});

        }).then ((updatedUser) => {

            // return the updated user
            return res.status (200).send ({
                status: 'succcess',
                updatedUser,
                auth_token,
                refresh_token
            })

        }).catch ((error) => {

            // return the catched error
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
    signinController
}