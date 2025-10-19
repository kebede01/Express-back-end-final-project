const router = require("express").Router();

const getDone = () => {
console.log('Router called');
}
router.get("/", getDone);

router.get("/:id", () => {
  console.log('Router id called');
});

router.post("/", () => {
  console.log('Router Posted');
});

router.delete("/:id", () => {
  console.log('Router deleted');
});

router.put("/:id", () => {
  console.log('Router updated');
});
module.exports = router