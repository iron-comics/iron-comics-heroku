require("dotenv").config();
const express = require("express");
const passport = require("passport");
const comicsRoutes = express.Router();
const axios = require("axios");
const Comic = require("../models/Comic");
const User = require("../models/User");
const List = require("../models/List");

comicsRoutes.get("/add", (req, res, next) => {
  const idcomic = req.query.id;
  const idList = req.query.name;
  if (!idcomic) {
    res.redirect("/lists/list");
    return;
  }
  axios
    .get(
      `https://comicvine.gamespot.com/api/issues/?api_key=${
        process.env.API_KEY
      }&sort=issue_number:asc&filter=id:${idcomic}&format=json`
    )
    .then(comic => {
      const datacomic = comic.data.results[0];
      Comic.findOne({ id_comic: datacomic.id }, (err, c) => {
        if (c !== null) {
          search_list(idList, c.id, datacomic);
        } else {
          if (!datacomic.store_date) datacomic.store_date = "unknown";
          const newcomic = new Comic({
            title: datacomic.name,
            year: datacomic.store_date,
            volume: datacomic.volume.name,
            img_icon: datacomic.image.icon_url,
            img_medium: datacomic.image.medium_url,
            issue_number: datacomic.issue_number,
            id_comic: datacomic.id,
            id_volume: datacomic.volume.id
          });
          newcomic.save().then(() => {
            search_list(idList, newcomic.id, datacomic);
          });
        }
      });
    }).catch(() => {
      res.redirect("/lists/list")
    })
  const search_list = (idList, id_comic, datacomic) => {
    List.findOne({ _id: idList }, (err, l) => {
      if (l !== null) {
        for (let i = 0; i < l.id_comic.length; i++) {
          if (l.id_comic[i] == id_comic) {
            res.redirect(`/lists/list?id=${l.id}`);
            return;
          }
        }
        l
          .update({ $push: { id_comic } })
          .then(() => res.redirect(`/lists/list?id=${l.id}`));
      } else {
        res.redirect("lists/list");
      }
    })
    .catch(() => {res.redirect("/lists/list"); return;})
  };
});

comicsRoutes.get("/all", (req, res) => {
  const idList = req.query.id;
  res.render("comics/allcomics", { idList });
});

comicsRoutes.post("/comic", (req, res) => {
  const idList = req.query.id;
  const Name = req.body.name;
  const issue_number = `issue_number:${req.body.issue}`;
  axios
    .get(
      `https://comicvine.gamespot.com/api/issues/?api_key=${
        process.env.API_KEY
      }&sort=issue_number:asc&filter=name:${Name},${issue_number}&format=json`
    )
    .then(comic =>
      res.render("comics/comics", { pepe: comic.data.results, idList })
    );
});
comicsRoutes.post("/add", (req, res) => {
  axios
    .get(
      `https://comicvine.gamespot.com/api/issues/?api_key=${
        process.env.API_KEY
      }&sort=issue_number:asc&filter=id:${id}&format=json`
    )
    .then(comic => {
      res.render("comics/add", { pepe: comic.data.results });
    });
});

/* CRUD -> Delete the comic from list */
comicsRoutes.get("/delete/list", (req, res) => {
  const idList = req.query.idList;
  List.findByIdAndRemove({ _id: idList }).then(() => {
    res.redirect("/lists");
  });
});

/* CRUD -> Delete the comic from list */
comicsRoutes.get("/delete/comic", (req, res) => {
  const idComic = req.query.idComic;
  const idList = req.query.idList;
  List.findByIdAndUpdate(
    { _id: idList },
    { $pull: { id_comic: idComic } }
  ).then(list => {
    res.redirect(`/lists/list?id=${idList}`);
  });
});

comicsRoutes.get("/comic_info", (req, res) => {
  const idComic = req.query.id;
  Comic.findById({ _id: idComic }).then(comic => {
    console.log(comic);
    res.render("comics/comic_info", { comic: comic });
  });
});

module.exports = comicsRoutes;
