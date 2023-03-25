const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Comment, validate } = require("../models/comment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const comments = await Comment.find().sort("name");
  res.send(comments);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const comment = new Comment({
    name: req.body.name,
    comments: req.body.comments,
    productId: req.body.productId,
  });
  await comment.save();

  res.send(comment);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

//router.delete("/:id", [auth, admin], async (req, res) => {

router.delete("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndRemove(req.params.id);

  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

router.get("/:id", async (req, res) => {
  const comment = await Comment.find({ productId: req.params.id });

  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

module.exports = router;
