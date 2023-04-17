const express = require("express");
const { connect } = require("./config/db");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.routes");
const { authenticate } = require("./middleware/authenticate");
const { Blacklist } = require("./models/balcklisting.model");
const jwt = require("jsonwebtoken");
const { User } = require("./models/user.model");
const { blogsRouter } = require("./routes/blogs.routes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);

app.use("/blogs", blogsRouter);

//Blacklisting logic

app.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["proxy-authorization"]?.split(" ")[1];
  try {
    const blacklist = new Blacklist({ token, refreshToken });
    await blacklist.save();
    res.status(200).json({ msg: "tokens successfully blacklisted" });
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

//Refresh Token Logic

app.post("/refresh", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const isBlacklisted = await Blacklist.find({ refreshToken: token });

    if (isBlacklisted.length) {
      return res
        .status(400)
        .json({ msg: "token is blacklisted. Please Login again" });
    }

    const decoded = jwt.verify(token, process.env.secret2);

    const user = await User.find({ _id: decoded._id });

    const newToken = jwt.sign({ _id: user[0]._id }, process.env.secret, {
      expiresIn: "60s",
    });

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
});

app.listen(4000, async () => {
  try {
    console.log("server is running");
    await connect;
    console.log("DB is connected");
  } catch (error) {
    console.log("DB isn't connected");
    console.log(error);
  }
});
