const express = require("express");
const router = express.Router();
const adminOrdersController = require("../controllers/adminOrders");
const isAuth = require("../MiddleWare/isauth"); 

router.get("/", isAuth, adminOrdersController.getAdminOrders);
router.put("/:id", isAuth, adminOrdersController.updateOrderStatus);

module.exports = router;