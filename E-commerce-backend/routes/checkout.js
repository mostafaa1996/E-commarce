const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const isAuth = require("../MiddleWare/isauth");

router.get("/", isAuth , checkoutController.getCheckoutData);

module.exports = router;