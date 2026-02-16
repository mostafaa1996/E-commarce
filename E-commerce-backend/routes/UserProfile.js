const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/UserProfileController");
const isAuth = require("../MiddleWare/isauth");


router.get("/", isAuth , UserProfileController.getUserProfile );

module.exports = router;