const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      index: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value, { minLength: 8 })) {
          throw new Error(
            "Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols.",
          );
        }
      },
    },
    age: {
      type: String,
      min: 10,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender Data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://example.com/default-profile-pic.jpg", // Default profile picture URL
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
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
  { timestamps: true },
);

// We should never use arrow functions for methods

// Schema Method to generate JWT
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user?._id }, "Shivam@1801", {
    expiresIn: "7d",
  });
  return token;
};

// Schema Method to validate Password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  // Don't interchange the order of parameters here as it will lead to incorrect validation
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user?.password,
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
