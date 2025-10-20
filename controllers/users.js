const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const success = require("../utils/errors");

const NotFoundError = require("../errors/not-found-err");

const BadRequestError = require("../errors/bad-request-err");
// const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err");

const ConflictError = require("../errors/conflict-err");

const errorUtils = require("../utils/errors");

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        username,
        email,
        password: hash,
      }).then((user) => {
        // Convert to plain object and delete password
        const userObject = user.toObject();
        delete userObject.password;

        res.status(errorUtils.SuccessfulOperation).send({
          data: userObject,
        });
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Check the values you provided for each field!")
        );
      }
      if (err.code === 11000) {
        // Duplicate key error — typically for unique fields like email
        return next(new ConflictError("Email already exists."));
      }
      // Handle other errors

      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id; // Get user ID from auth middleware
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(errorUtils.Successful).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user id format"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required!"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(errorUtils.Successful).send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      if (err.message.includes("Incorrect email or password")) {
        return next(new ForbiddenError("The user isn't authorized to login!"));
      }
      if (err.name === " ValidationError") {
        return next(
          new BadRequestError("Check the values you provided for each field!")
        );
      }
      return next(err);
    });
};

const deleteUser = (req, res, next) => {
  const userId = req.user._id; // the currently logged in user's id
  User.findByIdAndDelete(userId)
    .orFail()
    .then(() => {
      res
        .status(success.Successful)
        .send({ data: "Item deleted successfully" });
    });
};
module.exports = { createUser, getCurrentUser, login, deleteUser };
