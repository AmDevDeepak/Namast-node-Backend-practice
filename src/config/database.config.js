const mongoose = require("mongoose");
const config = require("./server.config");
const { MONGODB_URI } = config;
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database...");
  } catch (error) {
    console.error("Error while connecting to the database", error);
  }
};

module.exports = connectToDatabase;
