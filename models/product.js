const Joi = require("joi");
const mongoose = require("mongoose");
const { commentSchema } = require("./comment");
const { userSchema } = require("./user");

const Product = mongoose.model(
  "products",
  new mongoose.Schema({
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
    },
    stock: {
      type: Number,
    },
    likes: {
      type: Number,
    },
    date: {
      type: Date,

      default: Date.now,
    },
  })
);

function validateProduct(product) {
  const schema = {
    name: Joi.string(),
    image: Joi.string(),
    stock: Joi.number(),
    likes: Joi.number(),
    price: Joi.string(),
    description: Joi.string(),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
