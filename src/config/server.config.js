const dotenv = require("dotenv");
dotenv.config();
const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
};
module.exports = config;
