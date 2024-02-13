const router = require("express").Router();
const userController = require("./user.controller");
// const { validate } = require("./user.validator");
const { checkRole } = require("../../utils/sessionManager");

router.get("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.getAll();
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.post("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.create(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const result = await userController.register(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await userController.login(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// router.patch("/reset-password",checkRole(["admin"]),async(req,res,next)=>{
//   try{
//     const result = await userController.resetPassword(req.body);
//     res.json({data:result});
//   }catch(err){
//     next(err);
//   }

// });

module.exports = router;
