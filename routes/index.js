const router = require("express").Router();
const blogRouter = require("../modules/blogs/blog.route");
const userRouter = require("../modules/users/user.route");

router.use("/api/v1/users", userRouter);

router.use("/api/v1/blogs", blogRouter);
module.exports = router;
