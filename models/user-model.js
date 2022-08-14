const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleId: String,
  thumbnail: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
