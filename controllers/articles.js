const Article = require("../models/article");

const success = require("../utils/errors");


const NotFoundError = require("../errors/not-found-err");
// const BadRequestError = require("../errors/bad-request-err");
// const UnauthorizedError = require("../errors/unauthorized-err");
// const ForbiddenError = require("../errors/forbidden-err");

const getSavedArticles = (req, res, next) => {
  Article.find({})
    .orFail()
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError("There are no clothing items!");
      }
      res.status(success.Successful).send({ data: articles });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("The requested source was not found"));
      }
      return next(err);
    });
};

const saveArticle = async (req, res) => {
  try {
    const {
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content,
      source,
      keyWord
    } = req.body;

    const userId = req.user._id; // From your auth middleware

    const article = new Article({
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content,
      source,
      keyWord,
      owner: userId
    });

    const savedArticle = await article.save();
   return res.status(201).json(savedArticle);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
   return res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { getSavedArticles , saveArticle};