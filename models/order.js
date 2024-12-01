// models/order.js
const mongoose = require("mongoose");
const Joi = require("joi");


// Define the schema for the order
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    required: true,
    ref: "User",
  },
  books: [
    {
      title: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity:{ type: Number,required: true },
    },
  ],
  status: { type: String, default: "pending" }, // Optional, defaults to "pending"
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Order = mongoose.model("Order", orderSchema);

const validateOrder = (order) => {
  const schema = Joi.object({
    books: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      image: Joi.string().uri().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
    })).required(),
    status: Joi.string().optional(),
  });

  return schema.validate(order);
};

module.exports = {
  Order,
  validateOrder,
};
