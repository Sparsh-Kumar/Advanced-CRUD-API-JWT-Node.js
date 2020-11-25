
// importing all the necessary libraries
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const bcrypt = require ('bcrypt');

// forgot password controller
const forgotPassword = (req, res) => {
    try {
        if (!req.body.email) {
            throw new Error ('email is not present in password reset request');
        }
        let reset_token = undefined;
        const { email } = _.pick (req.body, ['email']);
        
        // first find if there is some user with the associated email address
        User.findOne ({
            email
        }).then ((foundUser) => {

            // if no user found then throw error that no user found with that associated email address
            if (!foundUser) {
                throw new Error ('No user found with that associated email address');
            }

            // if user found then generate a reset token to reset the password of the specified user
            reset_token = jwt.sign ({ _id: foundUser._id }, config.ResetPasswordSecret, { expiresIn: 60 }); // the reset token will expire in 60 seconds or 1 minute
            
            // return a promise to updated the user with the generated reset token
            return User.findOneAndUpdate ({
                _id: foundUser._id
            }, {
                $set: {
                    reset_token
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query'});

        }).then ((updatedUser) => {

            // send a mail to the user regarding the password reset
            return mailer (config.mailuser, updatedUser.email, 'reset your password', 'change your password by clicking on the link below', `<p>please change your password by clicking here <a href='${config.projectURI}/api/resetpassword/${reset_token}'>Change your password</a></p>`);
            
        }).then ((info) => {

            // if successfull then return the email send information
            return res.status (200).send ({
                status: 'success',
                reset_token,
                info
            })

        }).catch ((error) => {

            // in case of any error in promise chaining return the error with the message
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
    forgotPassword
}