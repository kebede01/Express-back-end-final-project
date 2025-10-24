const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const errorHandler = require("./middlewares/error-handler");

const { createUser, login } = require("./controllers/users");


const app = express();
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


app.use("/", mainRouter);


app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
