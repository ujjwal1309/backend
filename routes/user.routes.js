const express = require("express");
const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("all users");
});

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.find({ email });

    if (user.length) {
      return res
        .status(400)
        .json({ msg: "user already existed. Please login" });
    }

    const hashedPassword = bcrypt.hashSync(password, 5);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    res.status(200).json({ msg: "user has successfully created" });
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email });

    if (!user.length) {
      return res.status(400).json({ msg: "email and password doesn't match" });
    }

    const isMatched = bcrypt.compareSync(password, user[0].password);

    if (!isMatched) {
      return res.status(400).json({ msg: "password doesn't match" });
    }

    const token = jwt.sign({ _id: user[0]._id }, process.env.secret, {
      expiresIn: "10m",
    });

    const refreshToken = jwt.sign({ _id: user[0]._id }, process.env.secret2, {
      expiresIn: "3m",
    });

    res.status(200).json({msg:"successfully logged in",token,refreshToken})
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

module.exports = { userRouter };
