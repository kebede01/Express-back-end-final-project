const router = require("express").Router();

const userRouter = require("./users");

const articleRouter = require("./articles");

const { createUser, login } = require("../controllers/users");

const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);
router.use("/users", userRouter);
router.use("/articles", articleRouter);

module.exports = router;
