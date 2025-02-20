const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String // You should hash passwords before saving
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;