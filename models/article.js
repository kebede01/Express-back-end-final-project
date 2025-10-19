const mongoose = require("mongoose");

const validator = require("validator");

const articleSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    minlength: 2,
    maxlength:30,
  },
  title: {
     type: String,
    required: true,
    minlength: 2,
    maxlength:30,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength:500,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message:'invalid URL',
    },
    urlToImage: {
      type: String,
      required: true,
      validate: {
        validator: (urlToImage) => validator.isURL(urlToImage),
        message:'invalid URL',
      },
      publishedAt: {
        type: Date,

      },
      content: {
        type: String,
        required: true,
        minlength:10,
      },
      source: {
        type: String,
        required: true,
        minlength: 2,
         maxlength:30,
      },
      keyword: {
        type: String,
        required: true,
        minlength: 2,
        maxlength:20,
      }
    }
  }
})
module.exports = mongoose.model('article', articleSchema);