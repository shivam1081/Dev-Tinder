const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://shivamdubey1801:clCI8M8PZhaWax75@namastenode.kxool.mongodb.net/devTinder",
  );
};

module.exports = connectDB;

