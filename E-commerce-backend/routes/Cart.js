const express = require("express");
const router = express.Router();
const CartController = require("../controllers/Cart");
const isAuth = require("../MiddleWare/isauth");
const CouponEligibilityCheck = require("../MiddleWare/CouponEligibilityCheck");
const getUser = require("../MiddleWare/getUser");

router.post("/", isAuth, getUser, CartController.SyncCart);
router.get("/", isAuth, getUser, CartController.getCart);
router.get(
  "/cartPage",
  isAuth,
  getUser,
  CouponEligibilityCheck.generateCouponOffer,
  CartController.getCart,
);
router.put(
  "/applyPromo",
  isAuth,
  getUser,
  CouponEligibilityCheck.generateCouponOffer,
  CartController.applyPromoCode,
);
router.delete("/", isAuth, getUser, CartController.deleteCart);
router.delete("/:id", isAuth, getUser, CartController.deleteCartItem);

module.exports = router;
