const Article = require("../models/article");

const success = require("../utils/success");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err")

const getSavedArticles = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }
  return Article.find({ owner: req.user._id })

    .then((articles) => {
      if (articles.length === 0) {
        throw new NotFoundError("There are no articles found!");
      }
      return res.status(success.Successful).send({ data: articles });
    })
    .catch((err) => next(err));
};

const saveArticle = async (req, res, next) => {
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
      keyWord,
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
      owner: userId,
    });

    const savedArticle = await article.save();
    return res.status(success.SuccessfulOperation).json(savedArticle);
  } catch (err) {
    // console.log(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid request"));
    }
    return next(err);
  }
};

const deleteSavedArticle = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  Article.findById(itemId)
    .orFail()
    .then((article) => {
      if (userId.toString() !== article.owner.toString()) {
        return next(
          new ForbiddenError("You are not authorized to delete this item")
        );
      }
      return Article.findByIdAndDelete(itemId).then(() =>
        res
          .status(success.Successful)
          .send({ data: "Item deleted successfully" })
      );
    })

    .catch((err) => {
      // console.log(err);

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id format entered"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Article not found"));
      }

      return next(err);
    });
};

module.exports = {
  getSavedArticles,
  saveArticle,
  deleteSavedArticle,
};
