const express = require("express");
const router = express.Router();
const UserProfileSettingsController = require("../controllers/UserProfileSettings");
const isAuth = require("../MiddleWare/isauth");

router.put("/changePassword", isAuth, UserProfileSettingsController.changeUserPassword);

module.exports = router;