const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },   // <--- NEW
    bio: { type: String, default: "" },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
