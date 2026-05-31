const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../MiddleWare/isauth");
const {checkBlocked} = require("../MiddleWare/isUserBlocked");

router.post("/create", isAuth , checkBlocked , orderController.createOrder);


module.exports = router;