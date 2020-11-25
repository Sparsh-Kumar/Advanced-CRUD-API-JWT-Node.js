// https://protected-ravine-14155.herokuapp.com/api (backend api endpoint)

// importing all the requirements
const path = require ('path');
const mongoose = require ('mongoose');
const express = require ('express');
const bodyParser = require ('body-parser');
const { config } = require (path.resolve (__dirname, 'appConfig', 'config'));
const xss = require ('xss-clean');
const cors = require ('cors');
const helmet = require ('helmet');
const port = process.env.PORT || config.port;

// importing the router instance
const { authRoutes } = require (path.resolve (__dirname, 'router', 'authRoutes'));

// setting up mongoose
mongoose.Promise = global.Promise;
mongoose.connect (config.MongoURI).then (() => {
    console.log (`Connected to DB: ${config.MongoURI}`);
}).catch ((error) => {
    console.log (`Error: ${error.message}`);
})

// making the app instance
const app = express ();
app.use (helmet ());
app.use (cors ());
app.use (xss ());
app.use (bodyParser.json ({ limit: '10kb' }));

// making the api endpoint
app.use ('/api', authRoutes);

// making the server listen
app.listen (port, () => {
    console.log (`http://localhost:${port}`);
})