const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require("joi");


const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },

    catogory: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 200,
        enum: ["art", "history", "crime"], // Allowed categories
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    image: {
        type: String,
        default: "d.png"
    },
   descripe: {
        type: String,
        required: true,
        trim: true,
        minlength:3
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    cover: {
        type: String,
        required: true,
        enum: ["Soft" , "Hard"],
    },


    
}, {
    timestamps: true
});

function validateinputbook(obj) {
    const Schema = Joi.object({
      title: Joi.string().trim().min(3).max(200).required(),
      catogory: Joi.string().valid("art", "history", "crime"), // Allowed categories
      author: Joi.string().required(),
      descripe: Joi.string().trim().min(3).required(),
      price: Joi.number().min(0).required(),
      cover: Joi.string().valid("Soft" , "Hard").required()
    });
  
    return Schema.validate(obj);
  }
  
  function validateupdatebook(obj) {
      const Schema = Joi.object({
        title: Joi.string().trim().min(3).max(200),
        author: Joi.string(),
        descripe: Joi.string().trim().min(3),
        price: Joi.number().min(0),
        cover: Joi.string().valid("Soft" , "Hard").required(),
        catogory: Joi.string().valid("art", "history", "crime") // Optional validation for category

      });
    
      return Schema.validate(obj);
    }

const Book = mongoose.model("Book" , BookSchema);

module.exports = {
    Book,
    validateinputbook,
    validateupdatebook
};