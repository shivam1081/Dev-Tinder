const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://shivamdubey1801:hSvJZ3d15S1yvZ30@namastenode.kxool.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

