const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

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
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(dataForUpdate).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (dataForUpdate?.skills?.length > 10) {
      throw new Error ("Skills array cannot have more than 10 items");
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
  console.log(req.body);
  // const userObj = {
  //   firstName: "Shivam",
  //   lastName: "Dubey",
  //   emailId: "shivamdubey1801@gmail.com",
  //   password: "shivam123",
  //   age: "25",
  // };
  // Creating a new instance of the user model
  const user = new User(req.body);
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
