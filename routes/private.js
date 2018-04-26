const express = require('express');
const privateRoutes  = express.Router();
const List = require("../models/List");
const Comic = require("../models/Comic");
const User = require("../models/User");

/* GET home page */
privateRoutes.get('/user', (req, res, next) => {
  List.find({id_user:req.user.id})
  .populate("id_comic", "title img_icon")  
  .then( list => {
    for (let i = 0; i < list.length; i++) {
      list.splice(4, list.length)     
    }
    for (let i = 0; i < list.length; i++) {
      list[i].id_comic.splice(5, list[0].id_comic.length);
    }
    res.render('private/user', {user:req.user, list});
  });
});

/* CRUD -> Udpate, show user update form */
privateRoutes.get("/edit", (req, res) => {
User.findById(req.params.id).then(user => {
    res.render("private/edit", {user:req.user});
  });
});

/* CRUD -> Udpate, update the user in DB */
privateRoutes.post("/edit", (req, res) => {
  const { firstname, lastname, birthday, email, username } = req.body;
  const updates = { firstname, lastname, birthday, email, username };
  User.findByIdAndUpdate(req.user.id, updates).then(() => {
    res.redirect("/private/user");
  });
});

/* CRUD -> Delete the user in DB */
privateRoutes.get("/delete", (req, res) => {
  User.findByIdAndRemove(req.user.id).then(() => {
    res.redirect("/");
  });
});

module.exports = privateRoutes;
