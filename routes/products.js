const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { Product, validate } = require("../models/product");
const { Comment } = require("../models/comment");

const mongoose = require("mongoose");
const router = express.Router();

const getProducts = async (req, res, next) => {
  try {
    const result = await Product.find().sort("-date");
    res.status(200);
    const response = {
      viewImages: result.map((res) => {
        return {
          _id: res._id,
          name: res.name,
          price: res.price,
          image: `data:image/jpeg;base64,${res.image}`,
          description: res.description,
          likes: res.likes,
        };
      }),
    };
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

router.route("/download").get(getProducts);

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/PNG" ||
      file.mimetype === "image/JPG" ||
      file.mimetype === "image/JPEG" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      console.log("Something Went Wrong");
    }
  },
});
//router.post('/', upload.single('image'), async (req, res) => {
router.post("/", async (req, res) => {
  // console.log(req.body.image);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const comment = await Comment.findById(req.body.itemId);
  // if (!comment) return res.status(400).send("Invalid comment.");

  // let pname = await Product.findOne({ name: req.body.name });
  // if (pname) {
  //   fs.unlink(req.file.path, (err) => {
  //     if (err) console.log(err);
  //     console.log("Image file was deleted");
  //   });
  //   return res.status(400).send("Product already registered.");
  // }
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    description: req.body.description,
    stock: req.body.stock,
    likes: 0,
  });
  await product.save();

  res.send(product);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const comment = await Comment.findById(req.body.itemId);
  if (!comment) return res.status(400).send("Invalid comment.");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      stock: req.body.stock,
      likes: req.body.likes,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});
router.put("/likes/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: +1 } },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});
router.put("/likes/unlike/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: -1 } },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

module.exports = router;
