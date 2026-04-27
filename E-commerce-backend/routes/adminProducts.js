const adminProductsController = require("../controllers/adminProducts");
const express = require("express");
const router = express.Router();
const isAuth = require("../MiddleWare/isauth");

router.get("/", isAuth, adminProductsController.getAdminProducts);
router.post("/", isAuth, adminProductsController.addProduct);
router.put("/:id", isAuth, adminProductsController.updateProduct);
router.get("/:id", isAuth, adminProductsController.getSingleProductById);
router.delete("/:id", isAuth, adminProductsController.deleteProduct);

module.exports = router;