const config = require("config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);

//Import Routes
const comments = require("./routes/comments");
const customers = require("./routes/customers");
const products = require("./routes/products");
// const nodemailer = require("./routes/nodemailer");
const orders = require("./routes/orders");
const messages = require("./routes/messages");
const posts = require("./routes/posts");
const payments = require("./routes/payments");
const users = require("./routes/users");
const auth = require("./routes/auth");

const express = require("express");
const app = express();
const cors = require("cors");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
mongoose
  .connect("mongodb+srv://ten3live:sajjadali7@sajjadsolangi.eduls.mongodb.net/test")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB..."));
mongoose.set("strictQuery", true);
//Use Routes

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
app.use(express.json());
app.use(cors());
// app.use(express.static("./public/uploads"));

app.use("/api/comments", comments);
app.use("/api/messages", messages);
app.use("/api/customers", customers);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/payments", payments);
app.use("/api/posts", posts);
app.use("/api/users", users);
// app.use("/api/email", nodemailer);
app.use("/api/auth", auth);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
