const jwt = require("jsonwebtoken");

const { Joi } = require("celebrate");

const { JWT_SECRET } = require("../utils/config");

// const errorUtils = require("../utils/errors");
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = (next) =>
  next(new UnauthorizedError("User is not authorized!"));

const objectIdSchema = Joi.string().hex().length(24).required();

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return handleAuthError(next);
  }

  try {
    const payload = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

    const { error } = objectIdSchema.validate(payload._id);
    if (error) {
      return next(new UnauthorizedError("Invalid user ID"));
    }

    req.user = payload;
    return next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return handleAuthError(next);
  }
};
