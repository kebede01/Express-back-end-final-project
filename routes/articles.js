const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getSavedArticles, saveArticle, deleteSavedArticle } = require("../controllers/articles");

router.use(auth);
router.get("/", getSavedArticles);
router.delete("/:itemId", deleteSavedArticle )
router.post("/", saveArticle);

module.exports = router;