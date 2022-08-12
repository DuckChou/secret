//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();
// console.log(process.env.SECRET);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

// const encKey = process.env.SOME_32BYTE_BASE64_STRING;
// const sigKey = process.env.SOME_64BYTE_BASE64_STRING;

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);



app.get("/", function (req, res) {
  res.render("home");
})

app.get("/login", function (req, res) {
  res.render("login");
})

app.post("/login", function (req, res) {
  User.findOne({ $and: [{ email: req.body.username }, { password: req.body.password }] }, function (err, foundUser) {
    // console.log(foundUser);
    if (!err && foundUser) {
      res.render("secrets")
    }
  })
})

app.get("/register", function (req, res) {
  res.render("register");
})

app.post("/register", function (req, res) {
  // console.log(req.body);
  const email = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    email: email,
    password: password
  })

  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  })
})




app.listen(3000, function () {
  console.log("server started on port 3000.")
})
