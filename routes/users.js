const router = require("express").Router();

const { getCurrentUser, deleteUser } = require("../controllers/users");

const auth = require("../middlewares/auth");


router.use(auth);
router.get("/me", getCurrentUser);
router.delete("/:id", deleteUser);



module.exports = router