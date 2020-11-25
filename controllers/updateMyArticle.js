
// importing all the requirements

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Article } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Article'));
const _ = require ('lodash');
const { validateTitle, validateDescription } = require (path.resolve (__dirname, '..', 'validators', 'validator'));

// defining the updateMyArticle controller

const updateMyArticle = (req, res) => {
    try {

        // if no articleId is specified in the request parameters then throw an error

        if (!req.params.articleId) {
            throw new Error ('no specified articleId');
        }

        // take all the fields that are specified in the request body
        const { title, description } = _.pick (req.body, ['title', 'description']);

        // Check if both of them are undefined then 
        // throw an error to specified at least one of them

        if (! (title || description)) {
            throw new Error ('please specify at least one of the title or description an appropriate value');
        }

        const modifyingObject = {};
        if (title && title.length && validateTitle (title)) {
            modifyingObject.title = title;
        }

        if (description && description.length && validateDescription (description)) {
            modifyingObject.description = description;
        }

        // otherwise take the articleId and put it into a constant variable

        const articleId = req.params.articleId;

        // check if the article with the specified articleId exists

        Article.findOne ({
            _id: articleId
        })
        .then ((foundArticle) => {

            // if no article is found with the specified ArticleId then throw error;
            if (!foundArticle) {
                throw new Error ('no article foud with the specified articleId');
            }

            // if an aricle is found then perform check if the user is authorized to update the article or not
            if (!(foundArticle.author.toString () === req.founduser._id.toString ())) {
                throw new Error ('you are not authorized to update the given article');
            }

            // if you are authorized to update the article then in that case
            // proceed

            // return a promise to update an article with a given id

            return Article.findOneAndUpdate ({
                _id: foundArticle._id
            }, {
                $set: modifyingObject
            }, { upsert: true, new: true, runValidators: true, context: 'query'});

        })
        .then ((updatedArticle) => {

            // return an updated article to the user
    
            return res.status (200).send ({
                status: 'success',
                updatedArticle
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

// exporting the updateMyArticle Controller
module.exports = {
    updateMyArticle
}