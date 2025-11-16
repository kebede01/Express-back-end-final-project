const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

// const errorUtils = require("../utils/errors");
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = (next) =>  next(new UnauthorizedError('User is not authorized!'));

module.exports = (req, res, next) => {

 const token = req.cookies.jwt;
 if (!token) {
   return handleAuthError(next);
  }

   let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    console.error(err); // always log those errors
   return handleAuthError(next);
  }
return next(); // passing the request further along
};
