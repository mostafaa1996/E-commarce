const express = require("express");
const router = express.Router();
const CartController = require("../controllers/Cart");
const isAuth = require("../MiddleWare/isauth");


router.post("/", isAuth , CartController.SyncCart);
router.get("/", isAuth , CartController.getCart );
router.delete("/", isAuth , CartController.deleteCart);
router.delete("/:id", isAuth , CartController.deleteCartItem);

module.exports = router;