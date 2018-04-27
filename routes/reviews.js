const express = require("express");
const reviewRoutes = express.Router();
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");
const Review = require("../models/Review");
const Comment = require("../models/Comment");

reviewRoutes.get("/", (req, res) => {
  Review.find()
    .populate("id_comic", "title img_icon")
    .then(review => res.render("reviews/reviews", { review }));
});

reviewRoutes.get("/review", (req, res) => {
  const id = req.query.id;
  Review.findById(id)
    .populate("id_comic", "title img_icon")
    .then(review => {
      Comment.find({ id_review: id })
        .populate("id_review")
        .populate("id_user")
        .then(commets => {
          console.log(review);
          res.render("reviews/comments", { review, commets });
        });
    });
});

reviewRoutes.post("/review", (req, res) => {
  const id_user = req.user.id;
  const text = req.body.text;
  const id_review = req.query.id;
  const comment = new Comment({ id_user, text, id_review });
  comment.save().then(() => {
    res.redirect(`/reviews/review?id=${id_review}`);
  });
});

reviewRoutes.get("/myreviews", (req, res) => {
  Review.find({ id_user: req.user.id })
    .populate("id_comic", "title img_icon")
    .then(reviews => res.render("reviews/my_reviews", { reviews }));
});

reviewRoutes.get("/edit", (req, res) => {
  const idReview = req.query.id;
  const id_user = req.user.id;
  Review.findOne({ _id: idReview })
    .populate("id_comic", "title")
    .then(review => {
      if (req.user.id != review.id_user) {
        res.redirect("/reviews/myreviews");
        return;
      }
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
        });
    })
    .catch(() => res.redirect("/reviews"));
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
  Review.findById(id_review)
  .then(review => {
    if(review.id_user != req.user.id){
      res.redirect("/reviews")
      return
    }
  })
  .catch(() => res.redirect("/reviews"))
  Review.findByIdAndUpdate(id_review, updates)
  .then(review => {    
    res.redirect("/reviews/myreviews");
  })
});

reviewRoutes.get("/delete", (req, res) => {
  const id_review = req.query.id;
  Review.findById(id_review).then(review => {
    if (req.user.id != review.id_user) {
      res.redirect("/reviews");
      return;
    }
  }).catch(() => {
    res.redirect("/reviews");
      return;
  })
  Comment.find({ id_review }).then(comments => {
    for (let i = 0; i < comments.length; i++) {
      comments[i].remove({});
    }
    Review.findByIdAndRemove(id_review).then(() => {
      res.redirect("/reviews/myreviews");
    });
  });
});

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
