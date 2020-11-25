

// importing the rate limiter file
const rateLimiter = require ('express-rate-limit');

// Rate Limiter to handle creation of accounts
const createAccountLimiter = rateLimiter ({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many accounts are created from this ip please try after 1 minute !'
});


// Rate Limiter to handle the forgot password attempts
const forgotPasswordLimiter = rateLimiter ({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many password reset attempts are done from this ip, please try after 1 minute !'
});


// Exporting the CreateAccountLimiter and forgot Password Limiter
module.exports = {
    createAccountLimiter,
    forgotPasswordLimiter
}