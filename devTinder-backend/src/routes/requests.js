// Package Imports
const express = require("express");

// File Imports
const { userAuth } = require("../middlewares/auth");

// Variables
const requestRouter = express.Router();

// API to send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sending a connection Request");
    res.send(user?.firstName + " send the Connection Request");
  } catch (err) {
    res.status(400).send("Error:" + err?.message);
  }
});

module.exports = requestRouter;
