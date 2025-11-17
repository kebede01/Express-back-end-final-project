const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const success = require("../utils/success");

const BadRequestError = require("../errors/bad-request-err");

const UnauthorizedError = require("../errors/unauthorized-err");

const ConflictError = require("../errors/conflict-err");

const getCurrentUser = (req, res, next) => {
   console.log('req.user:', req.user);

  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(success.Successful).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user id format"));
      }
      return next(err);
    });
};

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
      })
    )
    .then((user) => {
      // Convert to plain object and delete password
      const userObject = user.toObject();
      delete userObject.password;

      return res.status(success.SuccessfulOperation).send({
        data: userObject,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Check the values you provided for each field!")
        );
      }
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists."));
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
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

      // const token = {
      //   token: jwt.sign({ _id: user._id }, JWT_SECRET, {
      //     expiresIn: "7d",
      //   })
      // }
      res.cookie("jwt", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
         secure: false, // set to true only in production with HTTPS

        sameSite: "None", // or "Lax" depending on your frontend
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}).status(success.Successful).send({token })
    })
    .catch((err) => {
      console.error(err);
      if (err.message.includes("Incorrect email or password")) {
        return next(
          new UnauthorizedError("The user used incorrect email or password!")
        );
      }
      if (err.name === "ValidationError") {
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
   .then(() => res.status(success.Successful).send({ data: "Item deleted successfully" })
    )
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};
module.exports = { createUser, getCurrentUser, login, deleteUser };
