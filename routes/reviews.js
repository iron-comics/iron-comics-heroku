const express = require("express");
const reviewRoutes = express.Router();
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");
const Review = require("../models/Review");

reviewRoutes.get("/", (req, res) => {
  Review.find()
    .populate("id_comic", "title img_icon")
    .then(review => res.render("reviews/reviews", { review }));
});

reviewRoutes.get("/myreviews", (req, res) => {
  Review.find({ id_user: req.user.id })
    .populate("id_comic", "title img_icon")
    .then(reviews => res.render("reviews/my_reviews", { reviews }));
});

reviewRoutes.get("/edit", (req, res) => {
  const idReview = req.query.id;
  Review.findOne({ _id: idReview })
    .populate("id_comic", "title")
    .then(review =>
      List.find({ id_user: req.user })
        .populate("id_comic", "title")
        .then(list => {
          let listTitle = [];
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].id_comic.length; j++) {
              if (listTitle.indexOf(list[i].id_comic[j]) === -1)
                listTitle.push(list[i].id_comic[j]);
            }
          }
          res.render("reviews/edit_reviews", { review, listTitle });
        })
    );
});

reviewRoutes.post("/edit", (req, res) => {
  const id_review = req.query.id;
  const rating = req.body.value;
  const id_comic = req.body.name;
  const reviewtext = req.body.text;
  const author = req.user.username;
  const id_user = req.user.id;
  const updates = {
    id_comic,
    rating,
    reviewtext,
    author: req.user.username,
    id_user: req.user.id
  };
  Review.findByIdAndUpdate(id_review, updates).then(() =>
    res.redirect("/reviews/myreviews")
  );
});

reviewRoutes.get("/delete", (req, res) =>{
    const id_review = req.query.id;
    Review.findByIdAndRemove(id_review)
    .then(() => res.redirect("/reviews/myreviews"))
})

reviewRoutes.get("/create", (req, res) => {
  List.find({ id_user: req.user })
    .populate("id_comic", "title")
    .then(list => {
      let listTitle = [];
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].id_comic.length; j++) {
          if (listTitle.indexOf(list[i].id_comic[j]) === -1)
            listTitle.push(list[i].id_comic[j]);
        }
      }
      res.render("reviews/create_review", { listTitle });
    });
});

reviewRoutes.post("/create", (req, res) => {
  const id_comic = req.body.name;
  const reviewtext = req.body.text;
  const rating = req.body.value;
  const review = new Review({
    id_comic,
    rating,
    reviewtext,
    author: req.user.username,
    id_user: req.user.id
  });
  review.save().then(() => res.redirect("/reviews/myreviews"));
});

module.exports = reviewRoutes;
