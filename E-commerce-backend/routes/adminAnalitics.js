const express = require("express");
const router = express.Router();
const adminAnaliticsController = require("../controllers/adminAnalitics");
const isAuth = require("../MiddleWare/isauth");

router.get("/", isAuth, adminAnaliticsController.getAdminAnalitics);

module.exports = router;