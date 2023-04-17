const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    author: String,
  },
  {
    versionKey: false,
  }
);

const Blogs = mongoose.model("blog", blogSchema);

module.exports = { Blogs };
