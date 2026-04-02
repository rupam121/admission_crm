const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
  role: {
  type: String,
  enum: ["admin", "officer", "management"],
  default: "officer"
}
}));