const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const isAuth = require("../MiddleWare/isauth");

router.post("/create/", isAuth , orderController.createOrder);


module.exports = router;