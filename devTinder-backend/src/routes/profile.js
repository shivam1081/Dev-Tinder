// Package Imports
const express = require("express");
const bcrypt = require("bcrypt");

// File Imports
const { userAuth } = require("../middlewares/auth");

// Variables
const profileRouter = express.Router();
const { validateProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    // Get the user profile from the JWT token
    res.status(400).send("Error fetching profile: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req?.user;

    // Logic for changing the data
    Object.keys(req?.body).forEach((key) => {
      loggedInUser[key] = req?.body?.[key];
    });

    // Saving the updated data to database.
    await loggedInUser.save();

    // Sending the customised response to the user.
    res.status(200).json({
      message: `${loggedInUser?.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error updating profile: " + error.message);
  }
});

// API for resetting the password

profileRouter.patch("/profile/reset-password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req?.user;

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      loggedInUser?.password
    );

    const currentNewPasswordSame = await bcrypt.compare(
      newPassword,
      loggedInUser?.password
    );

    if (!isPasswordValid) {
      throw new Error("Current Password is Incorrect");
    }

    if (currentNewPasswordSame) {
      throw new Error("New Password cannot same as Current Password");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser["password"] = passwordHash;

    await loggedInUser.save();

    res.status(200).send("Password Reset Successfully");
  } catch (err) {
    res.status(404).send("Error resetting Password " + err);
  }
});

module.exports = profileRouter;
