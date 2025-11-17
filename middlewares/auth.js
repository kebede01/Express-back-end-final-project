const jwt = require("jsonwebtoken");

const { Joi } = require("celebrate");

const { JWT_SECRET } = require("../utils/config");

// const errorUtils = require("../utils/errors");
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = (next) =>
  next(new UnauthorizedError("User is not authorized!"));

const objectIdSchema = Joi.string().hex().length(24).required();

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Raw cookie:", token);

  if (!token) {
    console.log("No token found");
    return handleAuthError(next);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Decoded payload:", payload);

    const { error } = objectIdSchema.validate(payload._id);
    if (error) {
      console.log("Invalid _id:", payload._id);
      return next(new UnauthorizedError("Invalid user ID"));
    }

    req.user = payload;
    return next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return handleAuthError(next);
  }
};
