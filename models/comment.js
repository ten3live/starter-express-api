const Joi = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

function validateComment(comment) {
  const schema = {
    name: Joi.string().required(),
    comments: Joi.string().required(),
    productId: Joi.string().required(),
  };

  return Joi.validate(comment, schema);
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validate = validateComment;
