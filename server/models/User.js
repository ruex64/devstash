const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  displayName: String,
  email: { type: String, required: true, unique: true },
  photoURL: String,
  role: { type: String, enum: ["admin", "contributor", "viewer"], default: "viewer" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
