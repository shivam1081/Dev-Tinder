// Package Imports
const express = require("express");
const cookieParser = require("cookie-parser");

// File Imports
const connectDB = require("./config/database");

// Variables
const app = express();

// This is the middleware to parse JSON request bodies
// It is because the server cannot read the JSON directly.
app.use(express.json());
app.use(cookieParser()); // This is the middleware to parse cookies from the request

// Route Imports
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

// This will check for all the APIs in all the routers. In which ever router the API is present, it will be executed.
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
