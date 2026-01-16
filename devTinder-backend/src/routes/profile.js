// Package Imports
const express = require("express");

// File Imports
const { userAuth } = require("../middlewares/auth");

// Variables
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    // Get the user profile from the JWT token
    res.status(400).send("Error fetching profile: " + err.message);
  }
});

module.exports = profileRouter;
