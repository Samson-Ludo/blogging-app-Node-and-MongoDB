const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  article_id: {
    type: String,
  },
  comment_subject: {
    type: String,
  },
  comment_body: {
    type: String,
  },
  comment_email: {
    type: String,
  },
  comment_author: {
    type: String,
  },
  comment_date: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
