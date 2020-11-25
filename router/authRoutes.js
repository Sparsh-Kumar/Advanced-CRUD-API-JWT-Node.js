
// making the router instance
const authRoutes = require ('express').Router ();
const path = require ('path');

// importing all the controllers
const { signupController } = require (path.resolve (__dirname, '..', 'controllers', 'signupController'));
const { signinController } = require (path.resolve (__dirname, '..', 'controllers', 'signinController'));
const { registerController } = require (path.resolve (__dirname, '..', 'controllers', 'registerController'));
const { refreshTokenController } = require (path.resolve (__dirname, '..', 'controllers', 'refreshTokenController'));
const { forgotPassword } = require (path.resolve (__dirname, '..', 'controllers', 'forgotPassword'));
const { resetTokenController } = require (path.resolve (__dirname, '..', 'controllers', 'resetTokenController'));
const { getAllArticles } = require (path.resolve (__dirname, '..', 'controllers', 'getAllArticles'));
const { createNewArticle } = require (path.resolve (__dirname, '..', 'controllers', 'createNewArticle'));
const { updateMyArticle } = require (path.resolve (__dirname, '..', 'controllers', 'updateMyArticle'));
const { deleteMyArticle } = require (path.resolve (__dirname, '..', 'controllers', 'deleteMyArticle'));
const { homePage } = require (path.resolve (__dirname, '..', 'controllers', 'homePage'));

// importing all the rate limiters
const { createAccountLimiter, forgotPasswordLimiter } = require (path.resolve (__dirname, '..', 'ratelimiters', 'ratelimiter'));

// importing the login Check Middleware
const { CheckLogin } = require (path.resolve (__dirname, '..', 'middlewares', 'CheckLogin'));

// handling the authentication routes
authRoutes.post ('/signup', createAccountLimiter, signupController);
authRoutes.get ('/register/:regtoken', registerController);
authRoutes.post ('/signin', signinController);
authRoutes.get ('/refreshtoken/:refresh_token', refreshTokenController);
authRoutes.patch ('/forgotpassword', forgotPasswordLimiter, forgotPassword);
authRoutes.patch ('/resetpassword/:reset_token', resetTokenController);

// handling the dashboard related routes
authRoutes.get ('/dashboard/getallarticles/:page/:limit', CheckLogin, getAllArticles);
authRoutes.post ('/dashboard/createnewarticle', CheckLogin, createNewArticle);
authRoutes.patch ('/dashboard/updatemyarticle/:articleId', CheckLogin, updateMyArticle);
authRoutes.delete ('/dashboard/deletemyarticle/:articleId', CheckLogin, deleteMyArticle);

// handling the homepage route
authRoutes.get ('/homepage', homePage);

// exporting the router object
module.exports = {
    authRoutes
}