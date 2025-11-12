const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit");

const helmet = require('helmet');

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const errorHandler = require("./middlewares/error-handler");

const { createUser, login } = require("./controllers/users");


const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/explorer_db')
  .then(() => {
    console.log(`Connected to mongoDB`);
  })
  .catch((err) => {
    console.error(err);
  })

app.post("/signin", login);
app.post("/signup", createUser);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 100 // you can make a maximum of 100 requests from one IP
});
app.use(limiter);
app.use("/", mainRouter);

app.get('/', (req, res) => {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
// Connected to mongoDB
// NotFoundError: The requested source was not found
//     at C:\Users\johnz\OneDrive\Desktop\Express-back-end-final-project\controllers\articles.js:22:21
//     at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
//   statusCode: 404
// }
// NotFoundError: The requested source was not found
//     at C:\Users\johnz\OneDrive\Desktop\Express-back-end-final-project\controllers\articles.js:22:21
//     at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
//   statusCode: 404
// }
// NotFoundError: The requested source was not found
//     at C:\Users\johnz\OneDrive\Desktop\Express-back-end-final-project\controllers\articles.js:22:21
//     at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
//   statusCode: 404
// }
