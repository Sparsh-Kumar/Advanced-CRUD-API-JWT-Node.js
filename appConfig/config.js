
const config = {
    MongoURI: 'YOUR DATABASE URI',
    port: 5000,
    SignUpSecret: '@#$B@#R@#$@#',
    SignInSecret: '@$@#%$%236@#^',
    RefreshTokenSecret: '#$%#$^#$&#&#',
    ResetPasswordSecret: '@#%@#$^#$^&',
    mailuser: 'YOUR EMAIL ID',
    saltRounds: 10,
    SENDGRID_API_KEY: 'YOUR SENDGRID API KEY',
    projectURI: 'http://localhost:5000'
}

module.exports = {
    config
}