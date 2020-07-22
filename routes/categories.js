const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

//READ Catogories - GET
router.get("/", (req, res, next) => {
  Category.find()
    .sort([["title", "ascending"]])
    .then((categories) => {
      res.render("categories", { title: "Categories", categories });
    })
    .catch((err) => res.send(err));
});

//POST Catogory - POST
router.post("/add", (req, res, next) => {
  req.checkBody("title", "title is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render("add_category", { errors, title: "Create Category" });
  } else {
    const title = req.body.title;
    const description = req.body.description;

    const newCategory = new Category({
      title,
      description,
    });

    newCategory
      .save()
      .then(() => {
        req.flash("success", "Category saved!");
        res.redirect("/manage/categories/");
      })
      .catch((err) => res.send(err));
  }
});

//EDIT Catogory - POST
router.post("/edit/:id", (req, res, next) => {
  req.checkBody("title", "title is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    Category.findById(req.params.id)
      .then((category) => {
        res.render("edit_category", {
          errors,
          title: "Edit category",
          category,
        });
      })
      .catch((err) => res.status(400).send("Error: " + err));
  } else {
    Category.findById(req.params.id)
      .then((category) => {
        category.title = req.body.title;
        category.description = req.body.description;

        category
          .save()
          .then(() => {
            req.flash("success", "Category Updated");
            res.redirect("/manage/categories/");
          })
          .catch((err) => res.status(400).send("Error: " + err));
      })
      .catch((err) => res.status(400).send("Error: " + err));
  }
});

//DELETE Catogory - DELETE
router.delete("/delete/:id", (req, res, next) => {
  Category.findByIdAndDelete(req.params.id)
    .then(() => res.status(200))
    .catch((err) => res.status(400).send("Error: " + err));
});

module.exports = router;
