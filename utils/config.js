require('dotenv').config();

const { JWT_SECRET = "super-secret-val" } = process.env;
module.exports = { JWT_SECRET };