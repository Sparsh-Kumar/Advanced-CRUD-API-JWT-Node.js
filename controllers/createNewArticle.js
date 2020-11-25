

// importing all the requirements

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Article } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Article'));
const { validateTitle, validateDescription } = require (path.resolve (__dirname, '..', 'validators', 'validator'));
const _ = require ('lodash');

// defining the create new article controller
const createNewArticle = (req, res) => {
    try {
        
        if (!req.body.title || !req.body.description) {
            throw new Error ('please enter all the details to create an article');
        } 

        const { title, description } = _.pick (req.body, ['title', 'description']);
        if (!(validateTitle (title) && validateDescription (description))) {
            throw new Error ('Title or Description may not have a proper alphanumeric value');
        }

        Article.create ({
            author: req.founduser._id,
            title,
            description
        }).then ((createdArticle) => {

            // insert into User article array the id of article
            // return a promise to push the article id into user's articles array
            
            return User.findOneAndUpdate ({
                // push the article id into the articles array of the user
                _id: req.founduser._id,
            }, {
                $push: {
                    articles: createdArticle._id
                }
            }, { upsert: true, new: true, runValidators: true, context: 'query'});

        }).then ((updateduser) => {
            return res.status (200).send ({
                status: 'success',
                message: 'successfully updated the user articles array',
                updateduser
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

// exporting the create new article controller
module.exports = {
    createNewArticle
}