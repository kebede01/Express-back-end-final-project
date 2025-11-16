const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getSavedArticles, saveArticle, deleteSavedArticle } = require("../controllers/articles");

const { validateSaveArticle } = require("../middlewares/validation");

router.use(auth);

router.get("/", getSavedArticles);// The auth middleware handles Joy validation as well for _id requirement
router.delete("/:itemId", deleteSavedArticle )
router.post("/", validateSaveArticle, saveArticle);

module.exports = router;