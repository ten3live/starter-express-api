const Joi = require("joi");
const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    user: {
      type: new mongoose.Schema({
        name: {
          type: String,

          minlength: 5,
          maxlength: 50,
        },
        email: {
          type: String,

          minlength: 5,
          maxlength: 50,
        },
        address: {
          type: String,

          minlength: 5,
          maxlength: 500,
        },
        shippingaddress: {
          type: String,

          minlength: 5,
          maxlength: 500,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
        mobile: {
          type: Number,
          minlength: 5,
          maxlength: 50,
        },
      }),
    },
    productordered: {
      type: new mongoose.Schema({
        ids: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        totalPrice: Number,
      }),
    },

    dateOut: {
      type: Date,

      default: Date.now,
    },
  })
);

function validateOrder(order) {
  const schema = {
    userids: Joi.objectId().required(),
    productids: Joi.objectId().required(),
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
