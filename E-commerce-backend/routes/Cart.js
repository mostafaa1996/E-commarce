const express = require("express");
const router = express.Router();
const CartController = require("../controllers/Cart");
const isAuth = require("../MiddleWare/isauth");
const CouponEligibilityCheck = require("../Middleware/CouponEligibilityCheck");


router.post("/", isAuth , CartController.SyncCart);
router.get("/", isAuth , CartController.getCart );
router.get("/cartPage", isAuth , CouponEligibilityCheck.generateCouponOffer , CartController.getCart);
router.put("/applyPromo", isAuth , CartController.applyPromoCode);
router.delete("/", isAuth , CartController.deleteCart);
router.delete("/:id", isAuth , CartController.deleteCartItem);

module.exports = router;