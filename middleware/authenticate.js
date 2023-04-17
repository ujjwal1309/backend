const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { Blacklist } = require("../models/balcklisting.model");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const isBlacklisted = await Blacklist.find({ token });

    if (isBlacklisted.length) {
      return res
        .status(400)
        .json({ msg: "token is blacklisted. Please Login again" });
    }

    const decoded = jwt.verify(token, process.env.secret);

    const user = await User.find({ _id: decoded._id });

    if (!user.length) {
      return res.status(400).json({ msg: "Please login first" });
    }

    req.user = user[0];

    next();
  } catch (error) {
    res.status(400).json({ msg: "error", error: error.message });
  }
};

module.exports = { authenticate };
