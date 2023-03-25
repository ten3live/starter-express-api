const { Message, validate } = require("../models/message");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/:sender", async (req, res) => {
  // console.log(req.params);
  const message = await Message.find()
    .or([
      {
        sender: req.params.sender,
      },
      {
        receiver: req.params.sender,
      },
    ])
    .sort("-date");

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.send(message);
});
router.get("/:sender/:receiver", async (req, res) => {
  // console.log(req.params);
  const message = await Message.find()
    .or([
      {
        sender: req.params.sender,
        receiver: req.params.receiver,
      },
      {
        receiver: req.params.sender,
        sender: req.params.receiver,
      },
    ])
    .sort("date");

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.send(message);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const recuser = await User.find({ email: req.body.receiver }).select(
    "-password"
  );
  const senduser = await User.find({ email: req.body.sender }).select(
    "-password"
  );

  const message = new Message({
    sender: req.body.sender,
    receiver: req.body.receiver,
    messages: req.body.messages,
    isReply: true,
    profilerec: recuser,
    profilesend: senduser,
  });
  await message.save();

  res.send(message);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { messages: req.body.messages },
    {
      new: true,
    }
  );

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.send(message);
});

//router.delete("/:id", [auth, admin], async (req, res) => {

router.delete("/:id", async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params.id);

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.send(message);
});

module.exports = router;
