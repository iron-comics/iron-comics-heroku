require("dotenv").config();
const express = require("express");
const passport = require("passport");
const listsRoutes = express.Router();
const axios = require("axios");
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");

listsRoutes.get("/", (req, res) => {
    List.find({id_user:req.user.id})
    .populate("id_comic", "title img_icon")  
    .then( list => {
      for (let i = 0; i < list.length; i++) {
        list[i].id_comic.splice(5, list[0].id_comic.length)     
      }
      res.render("lists/comic_lists", {list})
    });
  })

listsRoutes.get("/create", (req, res) => {
    res.render("lists/create")
})

listsRoutes.post("/create", (req, res) => {
    const name = req.body.name;
    const id_user = req.user.id;
    List.findOne({$and:[{name}, {id_user}]}).then(list => {
      if (list !== null) {
        res.redirect("/lists");
        return;
      } else {
        const list = new List({ name, id_user });
        list.save().then(() => res.redirect("/lists"));
      }
    });
  });

listsRoutes.get('/list', (req, res, next) => {
  const id = req.query.id;
  List.findOne({_id:id})
  .populate("id_comic", "title img_icon")  
  .then( list => {
    console.log(list)
    res.render('lists/list', {list});
  });
});

listsRoutes.get("/delete", (req, res) => {
  const id = req.query.id;
  List.findByIdAndRemove({_id:id}).then(() => {
    res.redirect("/");
  });
});

module.exports = listsRoutes;
