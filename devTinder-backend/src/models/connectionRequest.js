const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

// Setting up the compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// In Pre always write the normal function nmot the arrow function.
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the from and to user id is same as to user id
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(" Cannot send connection request to yourself!");
  }
  next();
});

const ConnectionRequestModal = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModal;
