const express = require("express");
const isAuth = require("../MiddleWare/isauth");
const router = express.Router();
const UserProfilePaymentsController = require("../controllers/UserProfilePayments");

router.post("/setUpPaymentMethods", isAuth, UserProfilePaymentsController.setUpPaymentMethods);

module.exports = router;