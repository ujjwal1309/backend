const express = require("express");
const { Blogs } = require("../models/blogs.model");
const { authenticate } = require("../middleware/authenticate");
const { User } = require("../models/user.model");

const blogsRouter = express.Router();

blogsRouter.get("/", authenticate, async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.status(200).send(blogs);
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

blogsRouter.post("/add", authenticate, async (req, res) => {
  const { title, content } = req.body;
  console.log(req.user.email);
  try {
    const blog = new Blogs({ title, content, author: req.user.email });
    await blog.save();
    res.status(200).json({ msg: "blog is successfully created" });
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

blogsRouter.patch("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blogs.find({ _id: id });
    const user = await User.find({ email: blog[0].author });
    console.log(user[0].role);
    if (blog[0].author === req.user.email) {
      await Blogs.findByIdAndUpdate(id, req.body);
      res.status(200).json({ msg: "blogs are successfully updated" });
    } else {
      if (req.user.role === "moderator") {
        await Blogs.findByIdAndUpdate(id, req.body);
        res.status(200).json({ msg: "blogs are successfully updated" });
      } else {
        res.status(401).json({ msg: "you are not authorized" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

blogsRouter.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blogs.find({ _id: id });
    const user = await User.find({ email: blog[0].author });
    console.log(user[0].role);
    if (blog[0].author === req.user.email) {
      await Blogs.findByIdAndDelete(id, req.body);
      res.status(200).json({ msg: "blogs are successfully updated" });
    } else {
      if (req.user.role === "moderator") {
        await Blogs.findByIdAndDelete(id, req.body);
        res.status(200).json({ msg: "blogs are successfully updated" });
      } else {
        res.status(401).json({ msg: "you are not authorized" });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

module.exports = { blogsRouter };
