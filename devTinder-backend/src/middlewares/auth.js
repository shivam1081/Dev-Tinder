const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }

    const decodedObj = await jwt.verify(token, "Shivam@1801");
    const { _id } = decodedObj;

    // Fetch a plain JS object (not a Mongoose Query) and remove sensitive fields
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};
module.exports = { userAuth };
