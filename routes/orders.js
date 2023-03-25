const { Order, validate } = require("../models/order");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const details = req.body.data;
  const products = req.body.productids;
  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].id);
    const Quantity = products[i].quantity;
    const Tprice = products[i].quantity * products[i].price;
    if (product.stock === 0)
      return res.status(404).send("Product not in stock.");

    await Product.updateOne({ _id: product._id }, { $inc: { stock: -1 } });

    let order = new Order({
      user: {
        _id: req.body.userids,
        name: details.name,
        email: details.email,
        mobile: details.mobile,
        address: details.address,
        shippingaddress: details.shippingaddress,
      },
      productordered: {
        ids: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: Quantity,
        totalPrice: Tprice,
      },
    });

    try {
      order = await order.save();

      res.send(order);
    } catch (ex) {
      res.status(404).send("Something failed." + ex);
    }
  }
});
router.get("/all", async (req, res) => {
  const orders = await Order.find().sort("-dateOut");
  res.send(orders);
});

router.get("/get/:email", async (req, res) => {
  const order = await Order.find({ "user.email": req.params.email }).sort(
    "-dateOut"
  );

  //  .findById(req.params.id).sort("-dateOut");

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
