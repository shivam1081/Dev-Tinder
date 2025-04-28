const express = require("express");
const app = express();
const {adminAuth}=require("./middlewares/auth");
// Concept of Middlewares 

app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
  res.send("Admin Data send Successfully");
})

app.delete("/admin/delete", (req, res) => {
  res.send("Admin Data Deleted Successfully");
})



// To test the query parameters
app.get("/dynamicroute", (req, res) => {
  console.log(req.query);
  res.send("Testing the dynamic route");
});

// /To test the dynamic route parameters
app.get("/dynamicrouteparam/:userid/:password", (req, res) => {
  console.log(req.params);
  res.send("Testing the dynamic route");
});

// This is the top level one and could be called in all scenarios
app.use("/user", (req, res) => {
  res.send("Shivam Dubey");
});

// It is exclusively for the get call
app.get("/user", (req, res, next) => {
  res.send("Making a get call");
});

// It is for the Post Call
app.post("/user", (req, res) => {
  res.send("Making a post call");
});

app.use("/", (req, res, next) => {
  console.log("Middleware function");
  next();
});
// This is for the concept of multiple route handlers
app.get(
  "/multpleroute",
  (req, res, next) => {
    console.log("First route handler");
    res.send("First route handler");
  },
  (req, res) => {
    res.send("Second route handler");
  }
);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
