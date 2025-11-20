require('dotenv').config();

const { JWT_SECRET = "super-secret-val" } = process.env;
// const setCorsHeaders= (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4000");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// }

const mongoIP = 'mongodb://127.0.0.1:27017/explorer_db';
module.exports = { JWT_SECRET, mongoIP };