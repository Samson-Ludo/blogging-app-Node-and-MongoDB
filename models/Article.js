const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  category: {
    type: String,
  },
  body: {
    type: String,
  },
  author: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("Articles", articleSchema);

module.exports = Article;
