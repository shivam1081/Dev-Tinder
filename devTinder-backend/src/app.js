const express = require("express");
const app = express();

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

app.listen(3000, () => {
  console.log("listening on port 3000");
});
