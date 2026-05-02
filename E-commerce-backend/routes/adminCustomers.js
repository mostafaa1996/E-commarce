const express = require("express");
const router = express.Router();
const adminCustomersController = require("../controllers/adminCustomers");
const isAuth = require("../MiddleWare/isauth"); 

router.get("/", isAuth, adminCustomersController.getAdminCustomers);
router.get("/:id", isAuth, adminCustomersController.getAdminCustomerDetails);
router.put("/:id", isAuth, adminCustomersController.updateAdminCustomerStatus);

module.exports = router;
