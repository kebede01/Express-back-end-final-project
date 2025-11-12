const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getSavedArticles, saveArticle } = require("../controllers/articles");

router.use(auth);
router.get("/", getSavedArticles);
router.post("/", saveArticle);

module.exports = router;