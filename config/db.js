const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/config.env` });

const db = 'mongodb+srv://31661:2nUDMsGem1pcUisT@cluster0.g98yvvs.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MongoDb is connected.");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
