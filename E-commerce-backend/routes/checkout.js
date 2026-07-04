const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const isAuth = require("../MiddleWare/isauth");
const {checkBlocked} = require("../MiddleWare/isUserBlocked");
const getUser = require("../MiddleWare/getUser");

router.get("/", isAuth , checkBlocked , getUser , checkoutController.getCartData);

module.exports = router;