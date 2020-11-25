

// importing all the requirements
const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Article } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Article'));
const _ = require ('lodash');

// defining the deleteMyArticle function
const deleteMyArticle = (req, res) => {
    try {
        
        // if no articleId is present in the request body then throw an error

        if (!req.params.articleId) {
            throw new Error ('request parameters does not have an articleid value');
        }

        // get the articleId to delete from request body into a constant 

        const articleId = req.params.articleId;

        // perform validation
        // => if the user that is 'logged in' is allowed to delete the required article
        // => if yes:
        // =>   proceed ()
        // => else:
        // =>   throw Error ()

        // find the article with the given id

        Article.findOne ({
            _id: articleId
        })
        .then ((foundArticle) => {

            // if an article is not found then throw error no article is found with a given id
            
            if (!foundArticle) {
                throw new Error ('no article is found with the given identifier');
            }

            // else perform the check

            if (!(foundArticle.author.toString () === req.founduser._id.toString ())) {
                throw new Error ('sorry! you are not authorized to delete this article')
            }

            //Article.findOneAndRemove ()
            return Article.findOneAndDelete ({
                _id: articleId
            })
        })
        .then ((deletedDoc) => {
            return res.status (200).send ({
                status: 'success',
                deletedDoc
            })
        })
        .catch ((error) => {
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

// exporting the delete my article function
module.exports = {
    deleteMyArticle
}