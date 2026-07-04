const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../MiddleWare/isauth");
const {checkBlocked} = require("../MiddleWare/isUserBlocked");
const getUser = require("../MiddleWare/getUser");

router.post("/create", isAuth, checkBlocked, getUser , orderController.createOrder);


module.exports = router;