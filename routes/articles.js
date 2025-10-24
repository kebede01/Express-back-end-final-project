const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getSavedArticles, saveArticle } = require("../controllers/articles");

// assuming the getSavedArticles doesn't require authorization protection
router.get("/", getSavedArticles);

router.use(auth);
router.post("/", saveArticle);

module.exports = router;