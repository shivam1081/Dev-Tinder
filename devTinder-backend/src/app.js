const express = require("express");
const app = express();

app.use("/test", (req, res, next) => {
  res.send("Hello from the server");
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
 