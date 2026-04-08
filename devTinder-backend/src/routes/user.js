const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    /*
    User should see all the user cards except
    0. his own card 
    1. his connections
    2. ignored people
    3. already send the connection request
    */
    const loggedInUser = req.user;

    const pageNumber = parseInt(req.query?.page) || 1;
    let limit = parseInt(req.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit; // This is to restrict the limit to 50 maximum, you can change it as per your requirement.

    // Find all connection request that I have sent or received
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId");

    // Create a set of user ids that I should hide from my feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req?.fromUserId.toString());
      hideUsersFromFeed.add(req?.toUserId.toString());
    });

    // Getting all the user that are not in the hideUsersFromFeed set and also not the logged in user himself.
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser?._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
});

module.exports = userRouter;
