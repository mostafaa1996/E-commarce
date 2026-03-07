const express = require("express");
const isAuth = require("../MiddleWare/isauth");
const router = express.Router();
const UserProfilePaymentsController = require("../controllers/UserProfilePayments");

router.post("/setUpPaymentMethods", isAuth, UserProfilePaymentsController.setUpPaymentMethods);
router.get("/getPaymentMethods", isAuth, UserProfilePaymentsController.getPaymentMethods);
router.put("/setDefaultPaymentMethod/:id", isAuth, UserProfilePaymentsController.setCardAsDefault);
router.delete("/deletePaymentMethod/:id", isAuth, UserProfilePaymentsController.deletePaymentMethod);

module.exports = router;