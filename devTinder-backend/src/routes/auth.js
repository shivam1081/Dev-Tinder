// Package Imports
const express = require("express");
const validator = require("validator");
// File Imports
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
// Variables
const authRouter = express.Router(); // app and this router works the same way.
const bcrypt = require("bcrypt");

// SIGNUP API
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of Data
    validateSignUpData(req);

    // Encrypt the Password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Store the user in the Database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating user: " + err.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not Valid");
    }
    const user = await User.findOne({
      emailId,
    });
    if (!user || user.length === 0) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Creating a JWT Token
      const token = await user.getJWT();

      console.log("Generated Token:", token);
      // Create a JWT Token and send it to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });
      res.send("Login Successful");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
});

// LOGOUT API
// Just remove the token and expire the cookie right there.
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Succssfull");
});

module.exports = authRouter;
