const mongoose = require("mongoose");

const validator = require("validator");

const articleSchema = new mongoose.Schema({
  author: { type: String, required: true, minlength: 2, maxlength: 30, },
  title: {
    type: String,
    required: true,
    minlength: 2,
    
  },
  description: {
    type: String,
    required: true,
    minlength: 5,

  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'invalid URL',
    },
  },
    urlToImage: {
      type: String,
      required: true,
      validate: {
        validator: (urlToImage) => validator.isURL(urlToImage),
        message: 'invalid URL',
      },
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      required: true,

    },
    source: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    keyWord: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
 { timestamps: true });

module.exports = mongoose.model('article', articleSchema);


