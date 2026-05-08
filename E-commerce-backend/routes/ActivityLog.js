const express = require("express");
const router = express.Router();
const  isAuth  = require("../MiddleWare/isauth");
const  ActivityLogController  = require("../controllers/ActivityLog");

router.get("/", isAuth, ActivityLogController.getActivityLogs);

module.exports = router;