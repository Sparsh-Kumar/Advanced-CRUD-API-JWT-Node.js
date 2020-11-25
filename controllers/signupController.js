
// importing all the necessary libraries
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { mailer } = require (path.resolve (__dirname, '..', 'mailer', 'mailer'));
const _ = require ('lodash');
const jwt = require ('jsonwebtoken');
const { validateEmail, validateUsername, validatePassword } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const bcrypt = require ('bcrypt');


// Defining the Signup Controller
const signupController = (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) {
            throw new Error ('please enter all the information to sign up !');
        }
        const { username, email, password } = _.pick (req.body, ['username', 'email', 'password']);
        if (!validateEmail (email) || !validateUsername (username) || !validatePassword (password)) {
            throw new Error ('you have not entered the information correct for sign up, please enter correct information');
        }

        // finding if some account already exists with those username and emails ?
        User.findOne ({
            $or: [
                { username },
                { email }
            ]
        }).then ((foundDoc) => {
            if (foundDoc) {
                throw new Error ('account with this username or email already exists');
            }

            // generating json web tokens
            const token = jwt.sign ({
                username,
                email,
                password
            }, config.SignUpSecret, { expiresIn: 60 }) // expires in 60 seconds or 1 minute

            // return mailer promise
            return mailer (config.mailuser, email, 'please! complete your sign up', 'please complete your registration by clicking on the link below', `<p>please complete your registration by clicking here <a href='${config.projectURI}/api/register/${token}'>Complete Your Registration</a></p>`);
        }).then ((data) => {
            return res.status (200).send ({
                status: 'success',
                data
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
    signupController
}