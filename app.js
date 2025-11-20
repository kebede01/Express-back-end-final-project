const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const { errors } = require("celebrate");

const helmet = require('helmet');

const { limiter} = require("./utils/limiter");

require("dotenv").config();

const mainRouter = require("./routes/index");

const { MONGOIP} = require("./utils/config")

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
  // origin: 'http://localhost:4000', // your frontend origin
  // credentials: true,              // 👈 allow cookies to be sent
}));


// Add this right after CORS
// app.use(setCorsHeaders);

mongoose.connect(MONGOIP)
  .then(() => { })
  .catch((err) => {
    console.error(err);
  })


app.use(limiter);
app.use(requestLogger);
app.post("/signin",validateLogin ,login);
app.post("/signup", validateCreateUser, createUser);
app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
app.listen(PORT);

