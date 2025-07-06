const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      min: 10,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender Data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://example.com/default-profile-pic.jpg", // Default profile picture URL
    },
    about: {
      type: String,
      default: "Hello, I am using DevTinder!",
    },
    skills: {
      type: [String],
      default: ["abc", "xyz"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
