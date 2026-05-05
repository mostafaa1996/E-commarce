const express = require("express");
const router = express.Router();
const adminInventoryController = require("../controllers/adminInventory");
const isAuth = require("../MiddleWare/isauth");

router.get("/", isAuth, adminInventoryController.getAdminInventory);
router.put("/:id", isAuth, adminInventoryController.updateInventory);


module.exports = router;