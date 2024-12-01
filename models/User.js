const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },

    fname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    lname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: Number,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: Number,
    },

    image: {
      type: String,
      default: "user.png"
  },

  },
  { timestamps: true }
);

UserSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
}

const User = mongoose.model("User", UserSchema);

function ValidateUserRegister(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    fname: Joi.string().trim().min(2).max(200).required(),
    lname: Joi.string().trim().min(2).max(200).required(),
    phone: Joi.string().pattern(/^\d+$/).min(11).required(),
    password: Joi.string().trim().min(6).required(),
    isAdmin: Joi.boolean(),
    image: Joi.string(), 

  });

  return schema.validate(obj);
}

function ValidateUserLogin(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(6).required(),
  });

  return schema.validate(obj);
}

function ValidateUserUpdate(obj) {
  const schema = Joi.object({
    fname: Joi.string().trim().min(2).max(200),
    lname: Joi.string().trim().min(2).max(200),
    phone: Joi.string().pattern(/^\d+$/).min(11),
    oldPassword: Joi.string(),
    password: Joi.string().trim().min(6),
    image: Joi.string(), 
  });

  return schema.validate(obj);
}

module.exports = {
  User,
  ValidateUserLogin,
  ValidateUserRegister,
  ValidateUserUpdate,
};
