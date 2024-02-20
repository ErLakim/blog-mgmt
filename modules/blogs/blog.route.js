const router = require("express").Router();
const BlogController = require("./blog.controller");
const { checkRole } = require("../../utils/sessionManager");
const { validate } = require("./blog.validator");

router.get("/", async (req, res, next) => {
  try {
    //database call
    const result = await BlogController.getAll();
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    //database call

    const { id } = req.params;
    const result = await BlogController.getById(id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  checkRole(["admin", "user"]),
  validate,
  async (req, res, next) => {
    try {
      //database call
      const data = req.body;

      const result = await BlogController.create(data);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

router.put("/:id", validate, async (req, res, next) => {
  try {
    //database call

    const data = req.body;
    const result = await BlogController.updateById(id, data);

    const { id } = req.params;
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate, async (req, res, next) => {
  try {
    //database call

    const { id } = req.params;
    const data = req.body;
    const result = await BlogController.updateById(id, data);

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    //database call

    const { id } = req.params;
    const result = await BlogController.deleteById(id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
