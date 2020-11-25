

// importing all the requirements
const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const path = require ('path');
const { validateTitle, validateDescription } = require (path.resolve (__dirname, '..', '..', 'validators', 'validator'));

// Defining the Article Schema
const ArticleSchema = new mongoose.Schema ({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: (title) => {
                return validateTitle (title);
            },
            message: '{VALUE} is not a valid title'
        }
    },

    description: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (description) => {
                return validateDescription (description);
            },
            message: '{VALUE} is not a valid description'
        }
    }

}, { timestamps: true });

ArticleSchema.plugin (uniqueValidator);

// Making the article model
const Article = mongoose.model ('article', ArticleSchema);

// Exporting the Article Model
module.exports = {
    Article
}