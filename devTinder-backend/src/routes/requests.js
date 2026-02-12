// Package Imports
const express = require("express");

// File Imports
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Variables
const requestRouter = express.Router();

// API to send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req?.user?._id;
      const toUserId = req?.params?.toUserId;
      const status = req?.params?.status;

      // CHECK 1:- Checking for the status that we are getting in the API Params
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }
      // CHECK 2:- If there is any exisitng request.
      // In findOne method you can provide the OR condition like below.

      const exisitingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (exisitingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exist" });
      }

      // CHECK3 :- Checking for the valid user.
      const isToUserIdValid = await User.findById({
        _id: toUserId,
      });

      if (!isToUserIdValid) {
        return res.status(404).json({ message: "User not Found!" });
      }

      // CHECK4 :- Checking if the user sending request to itself (THIS IS HANDLED BY PRE AT SCHEMA LEVEL)
      // if (toUserId === fromUserId) {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot send request to logged in user!" });
      // }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const interestedMessage = `${req?.user?.firstName} is ${status} in ${isToUserIdValid?.firstName}`;
      const ignoredMessage = `${isToUserIdValid?.firstName} is ${status} by ${req?.user?.firstName} `;

      res.json({
        message: status === "interested" ? interestedMessage : ignoredMessage,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err?.message);
    }
  },
);

module.exports = requestRouter;
