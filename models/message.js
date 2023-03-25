const Joi = require("joi");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  messages: {
    type: String,
    required: true,
  },
  isReply: Boolean,
  profilerec: [],
  profilesend: [],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
  const schema = {
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    messages: Joi.string().required(),
    isReply: Joi.boolean(),
  };

  return Joi.validate(message, schema);
}

exports.messageSchema = messageSchema;
exports.Message = Message;
exports.validate = validateMessage;
