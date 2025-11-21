require("dotenv").config();

const {
  JWT_SECRET = "super-secret-val",
  MONGOIP = "mongodb://127.0.0.1:27017/explorer_db",
  PORT = 3002,
} = process.env;

module.exports = { JWT_SECRET, MONGOIP, PORT };
