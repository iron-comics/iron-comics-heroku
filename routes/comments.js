const express = require("express");
const commentsRoutes = express.Router();
const User = require("../models/User");
const Review = require("../models/Review");
const Comment = require("../models/Comment");
const Comic = require("../models/Comic");

commentsRoutes.get("/", (req, res) => {
  const id_user = req.user.id;
  Comment.find({ id_user })
    .populate("id_review")
    .then(comments => {
      res.render("comments/my_comments", { comments });
    });
});
commentsRoutes.get("/edit", (req, res) => {
  const id_commet = req.query.id;
  Comment.findById(id_commet)
    .populate("id_review", "author id_comic")
    .then(comment =>
      Comic.findById(comment.id_review.id_comic).then(comic =>
        res.render("comments/edit_comment", { comment, comic })
      )
    );
});
commentsRoutes.post("/edit", (req, res) => {
  const text = req.body.text;
  const id_commet = req.query.id;
  const id_user = req.user.id;
  const id_review = req.query.id_review;
  const update = {text, id_user, id_review}
  console.log(text + " " + id_user + " " + id_review + " " + id_commet)
  Comment.findByIdAndUpdate(id_commet, {text, id_user, id_review}).then(() =>
    res.redirect("/comments")
  );
});
commentsRoutes.get("/remove", (req, res) => {
  const id_commet = req.query.id;
  Comment.findByIdAndRemove(id_commet).then(() => res.redirect("/comments"));
});
module.exports = commentsRoutes;
