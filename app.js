const express = require("express");

const mongoose = require("mongoose");

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/explorer_db')
  .then(() => {
    console.log(`Connected to mongoDB`);
  })
  .catch((err) => {
    console.error(err);
  })

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133'// paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
