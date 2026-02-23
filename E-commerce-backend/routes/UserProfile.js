const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/UserProfileController");
const isAuth = require("../MiddleWare/isauth");
const upload = require("../middleware/upload");

router.get("/", isAuth , UserProfileController.getUserProfile );
router.get("/personalInfo", isAuth , UserProfileController.getUserProfile );
router.post("/uploadProfilePic", isAuth , upload.single("image"), UserProfileController.uploadProfilePic);


module.exports = router;