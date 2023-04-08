const mongoose = require("mongoose");

const mongoURI = "mongodb://0.0.0.0:27017/inotebook";

const connectToMongoDB = () => {
  mongoose.connect(mongoURI).then(() => {
    console.log("Connected to MongoDB.");
  });
};
module.exports = connectToMongoDB;
