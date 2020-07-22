const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Article = require("../models/Article");

router.get("/articles", (req, res, next) => {
  Article.find()
    .sort([["created_at", "descending"]])
    .then((articles) => {
      res.render("manage_articles", {
        title: "Manage Articles",
        articles,
      });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

router.get("/categories", (req, res, next) => {
  Category.find()
    .sort([["title", "ascending"]])
    .then((categories) => {
      res.render("manage_categories", {
        title: "Manage Categories",
        categories,
      });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

router.get("/articles/add", (req, res, next) => {
  Category.find()
    .sort([["title", "ascending"]])
    .then((categories) => {
      res.render("add_article", {
        title: "Create Article",
        categories,
      });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

router.get("/categories/add", (req, res, next) => {
  res.render("add_category", { title: "Create Category" });
});

router.get("/articles/edit/:id", (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      Category.find()
        .sort([["title", "ascending"]])
        .then((categories) => {
          res.render("edit_article", {
            title: "Edit Article",
            article,
            categories,
          });
        });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

router.get("/categories/edit/:id", (req, res, next) => {
  Category.findById(req.params.id)
    .then((category) => {
      res.render("edit_category", { title: "Edit category", category });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

module.exports = router;
