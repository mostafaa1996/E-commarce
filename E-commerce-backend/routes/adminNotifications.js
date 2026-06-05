const express = require("express");
const router = express.Router();
const adminNotificationsController = require("../controllers/adminNotifications");
const isAuth = require("../MiddleWare/isauth");
const isadmin = require("../MiddleWare/isadmin");

router.get("/", isAuth, isadmin, adminNotificationsController.getAdminNotifications);
router.put("/allNotifications", isAuth, isadmin, adminNotificationsController.updateAllNotificationStatus);
router.put("/:id", isAuth, isadmin, adminNotificationsController.updateNotificationStatus);

module.exports = router;
