const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const { Joi } = require("celebrate");

// const errorUtils = require("../utils/errors");
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = (next) =>  next(new UnauthorizedError('User is not authorized!'));

const objectIdSchema = Joi.string().hex().length(24).required();

module.exports = (req, res, next) => {

 const token = req.cookies.jwt;
 if (!token) {
   return handleAuthError(next);
  }

   let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    // Validate _id using Joi
    const { error } = objectIdSchema.validate(payload._id);
 if (error) {
      return next(new UnauthorizedError("Invalid user ID"));
    }

    req.user = payload;
  } catch (err) {
    console.error(err); // always log those errors
   return handleAuthError(next);
  }
return next(); // passing the request further along
};
