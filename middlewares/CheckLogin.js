
// importing all the modules
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const jwt = require ('jsonwebtoken');
const _ = require ('lodash');

// Defining the CheckLogin Middleware
const CheckLogin = (req, res, next) => {
    try {

        // Check for authentication header in the request and if not available then throw Error
        if (!req.header('x-auth')) {
            throw new Error ('No authentication token is present in the request');
        }

        // Take the value from the 'x-auth' header from the request
        const token = req.header ('x-auth');
        const decodedToken = jwt.verify (token, config.SignInSecret);

        // If token is verified then find the User with the specified _id and attach it to request Object
        User.findOne ({
            _id: decodedToken._id
        }).then ((foundUser) => {
            
            // If no user is found with the specified _id then throw Error 
            if (!foundUser) {
                throw new Error ('No user found with that id specified in the token');
            }

            // Attach the founded user to the request Object
            req.founduser = foundUser;

            // Calling the next function to proceed furthur
            next ();

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

// exporting the Check Login Middleware
module.exports = {
    CheckLogin
}