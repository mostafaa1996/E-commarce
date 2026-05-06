const express = require("express");
const router = express.Router();
const adminCouponsDiscountController = require("../controllers/adminCouponsDiscount");
const isAuth = require("../MiddleWare/isauth");

router.get(
  "/",
  isAuth,
  adminCouponsDiscountController.getCouponsAndDiscounts,
);
router.post(
  "/coupon",
  isAuth,
  adminCouponsDiscountController.createCouponForCustomer,
);
router.put(
  "/coupon/:id",
  isAuth,
  adminCouponsDiscountController.updateCouponForCustomer,
);
router.delete(
  "/coupon/:id",
  isAuth,
  adminCouponsDiscountController.deleteCouponForCustomer,
);

router.post(
  "/discount",
  isAuth,
  adminCouponsDiscountController.createDiscountForProduct,
);
router.put(
  "/discount/:id",
  isAuth,
  adminCouponsDiscountController.updateDiscountForProduct,
);
router.delete(
  "/discount/:id",
  isAuth,
  adminCouponsDiscountController.deleteDiscountForProduct,
);

module.exports = router;


