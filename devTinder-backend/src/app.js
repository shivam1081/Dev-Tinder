const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
// This is the middleware to parse JSON request bodies
// It is because the server cannot read the JSON directly.
app.use(express.json());

// This is the middleware to parse cookies from the request
app.use(cookieParser());

// Get user by Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  const data = req.body;

  try {
    // const user = await User.find({
    //   emailId: userEmail,
    // });
    const user = await User.findOne({
      emailId: userEmail,
    });

    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user: " + err.message);
  }
});

// Feed API- GET/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching user: " + error.message);
  }
});

// Deleting a user by ID
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting user: " + error.message);
  }
});

// Updating a user by ID
app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req?.params?.userId;
  const dataForUpdate = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(dataForUpdate).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (dataForUpdate?.skills?.length > 10) {
      throw new Error("Skills array cannot have more than 10 items");
    }

    const user = await User.findByIdAndUpdate(userId, dataForUpdate, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Error updating user: " + error.message);
  }
});

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      // Creating a JWT Token
      const token = jwt.sign({ _id: user?._id }, "Shivam@1801", {
        expiresIn: "7d",
      });
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    // Get the user profile from the JWT token
    res.status(400).send("Error fetching profile: " + err.message);
  }
});

// API to send connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sending a connection Request");
    res.send(user?.firstName + " send the Connection Request");
  } catch (err) {
    res.status(400).send("Error:" + err?.message);
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
