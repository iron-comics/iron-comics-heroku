const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const uploadCloud = require("../config/cloudinary.js");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 12;

authRoutes.get("/login", ensureLoggedOut("/"), (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private/user",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", ensureLoggedOut("/"), (req, res, next) => {
  res.render("auth/signup", { title: "Comics" });
});

authRoutes.post("/signup", uploadCloud.single("photo"), (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const birthday = req.body.birthday;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const photo ={};
  if(req.file){
    photo.url = req.file.url;
    photo.secure_url = req.file.secure_url;
  }
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate nickname and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The nickname already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      birthday,
      email,
      username,
      password: hashPass,
      photo
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        req.login(newUser, function(err) {
          if (!err) {
            res.redirect("/private/user");
          } else {
            res.render("error", err);
          }
        });
      }
    });
  });
});

authRoutes.get("/logout", ensureLoggedIn("/auth/login"), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
