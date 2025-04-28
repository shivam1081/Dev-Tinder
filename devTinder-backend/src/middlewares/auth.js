const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xy";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorised User");
  } else {
    next();
  }
};
module.exports = { adminAuth };
