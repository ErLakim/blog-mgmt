const router = require("express").Router();
const userController = require("./user.controller");
// const { validate } = require("./user.validator");

router.get("/", async (req, res, next) => {
  try {
    const result = await userController.get;
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await userController.create(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
