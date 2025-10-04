const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/explorer_db').then(() => {
  console.log("Connectet to mongoose data base");
})
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
