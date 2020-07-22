const express = require("express");
const router = express.Router();

const Article = require("../models/Article");
const Category = require("../models/Category");
const Comment = require("../models/Comment");

router.get("/", (req, res, next) => {
  Article.find()
    .sort([["created_at", "descending"]])
    .then((articles) => {
      res.render("articles", {
        title: "Articles",
        articles,
      });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

router.get("/show/:id", (req, res, next) => {
  const commentQuery = { article_id: req.params.id };

  Article.findById(req.params.id)
    .then((article) => {
      Category.find()
        .sort([["title", "ascending"]])
        .then((categories) => {
          Comment.find(commentQuery).then((comments) => {
            res.render("article", {
              title: "Show an Article",
              article,
              categories,
              comments,
            });
          });
        });
    })
    .catch((err) => res.status(400).send("Error: " + err));
});

router.get("/category/:category_id", (req, res, next) => {
  const articleQuery = { category: req.params.category_id };
  const categoryQuery = { _id: req.params.category_id };

  Article.find(articleQuery)
    .sort([["created_at", "descending"]])
    .then((articles) => {
      Category.find(categoryQuery).then((category) => {
        res.render("category", {
          articles,
          category,
        });
      });
    })
    .catch((err) => res.status(400).send("Error: " + err));
  // res.render("category", { title: "Category Article" });
});

//Add Article - POST
router.post("/add", (req, res, next) => {
  req.checkBody("title", "title is required").notEmpty();
  req.checkBody("category", "category is required").notEmpty();
  req.checkBody("author", "author is required").notEmpty();
  req.checkBody("body", "body is required").notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    Category.find()
      .sort([["title", "ascending"]])
      .then((categories) => {
        res.render("add_article", {
          errors,
          title: "Create Article",
          categories,
        });
      })
      .catch((err) => res.status(400).send("Error: " + err));
  } else {
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const category = req.body.category;
    const body = req.body.body;
    const author = req.body.author;
    const created_at = req.body.created_at;

    const newArticle = new Article({
      title,
      subtitle,
      category,
      body,
      author,
      created_at,
    });

    newArticle
      .save()
      .then(() => {
        req.flash("success", "Article Added!");
        res.redirect("/manage/articles/");
      })
      .catch((err) => res.send(err));
  }
});

//Edit Article - POST
router.post("/edit/:id", (req, res, next) => {
  req.checkBody("title", "title is required").notEmpty();
  req.checkBody("category", "category is required").notEmpty();
  req.checkBody("author", "author is required").notEmpty();
  req.checkBody("body", "body is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    Article.findById(req.params.id)
      .then((article) => {
        Category.find()
          .sort([["title", "ascending"]])
          .then((categories) => {
            res.render("edit_article", {
              errors,
              title: "Edit Article",
              article,
              categories,
            });
          });
      })
      .catch((err) => res.status(400).send("Error: " + err));
  } else {
    Article.findById(req.params.id)
      .then((article) => {
        article.title = req.body.title;
        article.subtitle = req.body.subtitle;
        article.category = req.body.category;
        article.body = req.body.body;
        article.author = req.body.author;
        article.created_at = req.body.created_at;

        article
          .save()
          .then(() => {
            req.flash("success", "Article Updated!");
            res.redirect("/manage/articles/");
          })
          .catch((err) => res.send(err));
      })
      .catch((err) => res.send(err));
  }
});

//DELETE Catogory - DELETE
router.delete("/delete/:id", (req, res, next) => {
  Article.findByIdAndDelete(req.params.id)
    .then(() => res.status(200))
    .catch((err) => res.status(400).send("Error: " + err));
});

router.post("/comments/add/:id", (req, res, next) => {
  req.checkBody("comment_subject", "Subject is required").notEmpty();
  req.checkBody("comment_author", "Author is required").notEmpty();
  req.checkBody("comment_body", "Body is required").notEmpty();

  let errors = req.validationErrors();

  const commentQuery = { article_id: req.params.id };

  if (errors) {
    Article.findById(req.params.id)
      .then((article) => {
        Category.find()
          .sort([["title", "ascending"]])
          .then((categories) => {
            Comment.find(commentQuery).then((comments) => {
              res.render("article", {
                title: "Show an Article",
                article,
                categories,
                comments,
              });
            });
          });
      })
      .catch((err) => res.status(400).send("Error: " + err));
  } else {
    // Comment.find()
    //   .then((comment) => {
    //     comment.article_id = req.params.id;
    //     comment.comment_subject = req.body.comment_subject;
    //     comment.comment_body = req.body.comment_body;
    //     comment.comment_email = req.body.comment_email;
    //     comment.comment_author = req.body.comment_author;
    //     comment.created_at = req.body.created_at;

    //     comment
    //       .save()
    //       .then(() => {
    //         res.redirect("/articles/show/" + req.params.id);
    //       })
    //       .catch((err) => res.send(err));
    //   })
    //   .catch((err) => res.send(err));
    const article_id = req.params.id;
    const comment_subject = req.body.comment_subject;
    const comment_body = req.body.comment_body;
    const comment_email = req.body.comment_email;
    const comment_author = req.body.comment_author;
    const created_at = req.body.created_at;

    const newComment = new Comment({
      article_id,
      comment_subject,
      comment_body,
      comment_email,
      comment_author,
      created_at,
    });

    newComment
      .save()
      .then(() => {
        res.redirect("/articles/show/" + req.params.id);
      })
      .catch((err) => res.send(err));
  }
});

module.exports = router;
