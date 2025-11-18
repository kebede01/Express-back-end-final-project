const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const { errors } = require("celebrate");

const rateLimit = require("express-rate-limit");

const helmet = require('helmet');

require("dotenv").config();

const mainRouter = require("./routes/index");

const { PORT = 3002 } = process.env;

const errorHandler = require("./middlewares/error-handler");

const { createUser, login } = require("./controllers/users");

const { validateCreateUser, validateLogin } = require("./middlewares/validation");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: 'http://localhost:4000', // your frontend origin
  credentials: true,              // 👈 allow cookies to be sent
}));


// 👇 Add this right after CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/explorer_db')
  .then(() => {
    console.log(`Connected to mongoDB`);
  })
  .catch((err) => {
    console.error(err);
  })

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 100 // you can make a maximum of 100 requests from one IP
});
app.use(limiter);
app.use(requestLogger);
app.post("/signin",validateLogin ,login);
app.post("/signup", validateCreateUser, createUser);
app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

