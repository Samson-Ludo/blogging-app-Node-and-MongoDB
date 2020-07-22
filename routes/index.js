const express = require("express");
const router = express.Router();

const Article = require("../models/Article");

router.get("/", (req, res, next) => {
  Article.find()
    .limit(4)
    .sort([["created_at", "descending"]])
    .then((articles) => {
      res.render("index", {
        title: "Home page",
        articles,
      });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

module.exports = router;
