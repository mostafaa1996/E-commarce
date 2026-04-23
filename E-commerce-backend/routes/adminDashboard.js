const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboard");
const isAuth = require("../MiddleWare/isauth");


router.get("/", isAuth, adminDashboardController.getAdminDashboard);

module.exports = router;
