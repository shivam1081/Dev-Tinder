const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://shivamdubey1801:lSydg1mXMKIeGjVy@namastenode.kxool.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

