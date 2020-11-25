

const path = require ('path');
const { config } = require (path.resolve (__dirname, '..', 'appConfig', 'config'));
const jwt = require ('jsonwebtoken');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));


// On serving the homepage on Angular first we trigger this function

const homePage = (req, res) => {
    try {

        // If no authentication token is present in the localStorage of the user
        // then in that case the user is a new user

        if (!req.header ('x-auth')) {
            throw new Error ('no authentication token present');
        }

        // if an authentication token is present 
        // then take it into a new variable

        const token = req.header ('x-auth');
        
        // If the authentication token is expired then show him/her the login link to login again by going to the catch block
        const decodedToken = jwt.verify (token, config.SignInSecret);

        // If the authentication token is correct (that is retrieved from local storage of the user's browser )
        // then find the user having that authentication token
        User.findOne ({
            _id: decodedToken._id
        }).then ((foundUser) => {

            // If no user associated with that authentication token then may be the user gets deleted from DB or someone is tampering
            // from the authentication token therefore show them login link by jumping to the catch block

            if (!foundUser) {
                throw new Error ('no user found');
            }

            // If a user is found successfully associated with that authentication token then send him / her the dashboard link
            return res.status (200).send ({
                status: 'success',
                links: [
                    {linkname: 'home', href: '/your front end home route here'},
                    {linkname: 'dashboard', href: '/your front end dashboard route here'},
                    {linkname: 'logout', href: '/your front end logout route here'}
                ]
            })
        }).catch ((error) => {
            return res.status (200).send ({
                status: 'success',
                links: [
                    {linkname: 'home', href: '/your front end home route here'},
                    {linkname: 'signin', href: '/you front end sign in route here'},
                    {linkname: 'signup', href: '/your front end sign up route here'}
                ],
                message: error.message
            })
        })

    }
    catch (error) {
        return res.status (200).send ({
            status: 'success',
            links: [
                {linkname: 'home', href: '/your front end home route here'},
                {linkname: 'signin', href: '/your front end sign in route here'},
                {linkname: 'signup', href: '/your front end sign up route here'}
            ],
            message: error.message
        })
    }
}


module.exports = {
    homePage
}