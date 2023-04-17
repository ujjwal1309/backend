const mongoose = require("mongoose");

const blacklistingSchema = mongoose.Schema(
  {
    token: String,
    refreshToken: String,
  },
  {
    versionKey: false,
  }
);

const Blacklist = mongoose.model("blacklist", blacklistingSchema);

module.exports = { Blacklist };
