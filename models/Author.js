const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require("joi");

// Define Author Schema
const AuthorSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    image: {
        type: String,
        default: "d.png"
    },
}, {
    timestamps: true
});



const Author = mongoose.model("Author", AuthorSchema);

// Validation functions using Joi
function validateinputauthor(obj) {
    const Schema = Joi.object({
        firstname: Joi.string().trim().min(3).max(200).required(),
        lastname: Joi.string().trim().min(3).max(200).required(),
        image: Joi.string().uri(), // Assuming image should be a URI
    });

    return Schema.validate(obj);
}


function validateupdateauthor(obj) {
    const Schema = Joi.object({
        firstname: Joi.string().trim().min(3).max(200).required(),
        lastname: Joi.string().trim().min(3).max(200).required(),
        image: Joi.string(), // Assuming image should be a URI
    });

    return Schema.validate(obj);
}

module.exports = {
    Author,
    validateinputauthor,
    validateupdateauthor,
};
