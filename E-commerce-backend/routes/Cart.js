const express = require("express");
const router = express.Router();
const CartController = require("../controllers/Cart");
const isAuth = require("../MiddleWare/isauth");


router.post("/", isAuth , CartController.getCart );
router.get("/", isAuth , CartController.getCart );

module.exports = router;