const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Shivam",
    lastName: "Dubey",
    emailId: "shivamdubey1801@gmail.com",
    password: "shivam123",
    age: "25",
  };
  // Creating a new instance of the user model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating user: " + err.message);
  }
});

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
