const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const isAuth = require("../MiddleWare/isauth");
const {checkBlocked} = require("../MiddleWare/isUserBlocked");

router.get("/", isAuth , checkBlocked , checkoutController.getCartData);

module.exports = router;