const express = require("express");
const router = express.Router();
const adminCategoriesController = require("../controllers/adminCategories");
const isAuth = require("../MiddleWare/isauth");
const upload = require("../middleware/upload");

router.get("/", isAuth, adminCategoriesController.getAdminCategories);
router.post("/", isAuth, upload.single("icon"), adminCategoriesController.addCategory);
router.put("/:id", isAuth, upload.single("icon"), adminCategoriesController.updateCategory);
router.delete("/:id", isAuth, adminCategoriesController.deleteCategory);

module.exports = router;