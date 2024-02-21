const router = require("express").Router();
const multer = require("multer");
const BlogController = require("./blog.controller");
const { checkRole } = require("../../utils/sessionManager");
const { validate } = require("./blog.validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/blogs");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.originalname.split(".")[1]
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { filesize: Number(process.env.MAX_FILE_SIZE) },
});

router.get("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    //database call
    const { author, title, page, limit } = req.query;
    const search = { author, title };
    const result = await BlogController.list(search, page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/publishedOnly", async (req, res, next) => {
  try {
    //database call
    const { author, page, limit } = req.query;
    const result = await BlogController.getPublishedOnly(author, page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/authors", async (req, res, next) => {
  try {
    //database call
    const { author, page, limit } = req.query;
    if (!author) throw new Error("Author missing");
    // res.redirect(301, "/publishedOnly");
    const result = await BlogController.getAuthorBlogs(author, page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkRole(["admin", "user"]), async (req, res, next) => {
  try {
    //database call

    const { id } = req.params;
    const result = await BlogController.getById(id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/slug/:slug", async (req, res, next) => {
  try {
    //database call

    const { slug } = req.params;
    if (!slug) throw new Error("Slug is Missing");
    const result = await BlogController.getBySlug(slug);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  upload.single("image"),
  checkRole(["admin", "user"]),
  validate,
  async (req, res, next) => {
    try {
      //database call
      const data = req.body;
      if (req.file) {
        const { path } = req.file;
        data.image = path.replace("public", "");
      }
      const result = await BlogController.create(data);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  checkRole(["admin", "user"]),
  validate,
  async (req, res, next) => {
    try {
      //database call
      const data = req.body;
      const result = await BlogController.updateById(id, data);
      const { id } = req.params;
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  checkRole(["admin", "user"]),
  validate,
  async (req, res, next) => {
    try {
      //database call
      const { id } = req.params;
      const data = req.body;
      const result = await BlogController.updateById(id, data);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/status/:id",
  checkRole(["admin", "user"]),
  async (req, res, next) => {
    try {
      //database call
      const { id } = req.params;
      console.log("test");
      const result = await BlogController.updateStatus(id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", checkRole(["admin"]), async (req, res, next) => {
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
