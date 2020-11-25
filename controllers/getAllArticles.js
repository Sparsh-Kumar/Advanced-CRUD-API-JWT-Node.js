
// importing all the requirements

const path = require ('path');
const { User } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'User'));
const { Article } = require (path.resolve (__dirname, '..', 'Database', 'Models', 'Article'));
const _ = require ('lodash'); 

// apply pagination in this get All Articles

const getAllArticles = (req, res) => {
    try {

        // get the page and limit out of the api request

        const page = req.params.page ? parseInt (req.params.page): 1;
        const limit = req.params.limit ? parseInt (req.params.limit): 5;

        if ((page < 0) || (limit < 0)) {
            throw new Error ('page and limit can not have a negative values');
        }

        // get the startIndex values and get endIndex values 

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // making an empty object that holds the value of the current, prev and next pages

        const rep = {};

        // If the startIndex is greater than 0 then in that case
        // push previous page value and limit of data for each page

        if (startIndex > 0) {
            rep.previous = {
                details: {
                    page: page - 1,
                    limit
                }
            }
        }

        // push the current value in the rep object

        rep.current = {
            details: {
                page,
                limit
            }
        }


        // count the number of documents in the Articles collection of the database
        Article.countDocuments ({
            author: req.founduser._id
        }).then ((countDocs) => {

            // if endindex < counted Objects then make the next property in rep Object
            if (endIndex < countDocs) {
                rep.next = {
                    details: {
                        page: page + 1,
                        limit
                    }
                }
            }

            // return a promise to find the Articles having author the 'logged in' user

            return Article.find ({
                author: req.founduser._id
            })
            .limit (limit) // applying limit to the results found
            .skip (startIndex) // skipping a certain number of docs from start equal to startIndex
        })
        .then ((foundDocs) => {

            // return Docs to the user
            return res.status (200).send ({
                status: 'success',
                foundDocs,
                rep
            })
        })
        .catch ((error) => {

            // return any error to the user
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


// exporting the getAllArticles function

module.exports = {
    getAllArticles
}