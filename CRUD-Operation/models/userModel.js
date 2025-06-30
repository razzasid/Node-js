const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testapp1");

const userSchema = mongoose.Schema({
  image: String,
  email: { type: String, required: true, unique: true },
  name: String,
  username: String,
  password: { type: String, required: true },
});

module.exports = mongoose.model("user", userSchema);
