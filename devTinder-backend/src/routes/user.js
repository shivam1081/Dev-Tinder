const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age";

// Get all the Pending COnnection Request for the Logged In user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // This will populate the fromUserId field with the firstName, lastName and profilePicUrl of the user who sent the request.

    res.json({
      message: "Data fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("Error" + err.message);
  }
});

// API to get the list of all User Connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser?._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser?._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA); // This will populate the fromUserId and toUserId field with the firstName, lastName and profilePicUrl of the user who sent the request.

    const data = connectionRequests.map((row) => {
      // This is to check whehter the logged in user in the to user id or from user id and then return the other user data as connection data.
      if (row?.fromUserId?._id.equals(loggedInUser?._id)) { 
        return row?.toUserId;
      } else {
        return row?.fromUserId;
      }
    });

    res.json({
      message: "Connections fetched Successfully",
      data,
    });
  } catch (err) {
    req.statusCode(400).send("Error " + err.message);
  }
});

module.exports = userRouter;
