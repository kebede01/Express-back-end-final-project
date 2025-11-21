const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const { errors } = require("celebrate");

const helmet = require("helmet");

const { limiter } = require("./utils/limiter");

const mainRouter = require("./routes/index");

const { MONGOIP, PORT } = require("./utils/config");

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

mongoose
  .connect(MONGOIP)
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });

app.use(limiter);
app.use(requestLogger);

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
app.listen(PORT);
