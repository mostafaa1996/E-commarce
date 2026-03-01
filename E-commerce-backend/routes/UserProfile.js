const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/UserProfileController");
const isAuth = require("../MiddleWare/isauth");
const upload = require("../middleware/upload");
const {ValidatePersonalInfo} = require("../Validation/UpdatePersonalInfoValidator");
const isValid = require("../MiddleWare/isValid");

router.get("/", isAuth, UserProfileController.getUserProfile);
router.get("/personalInfo", isAuth, UserProfileController.getPersonalInfo);
router.post(
  "/uploadProfilePic",
  isAuth,
  upload.single("image"),
  UserProfileController.uploadProfilePic,
);
router.post(
  "/updatePersonalInfo",
  isAuth,
  ValidatePersonalInfo,
  isValid,
  UserProfileController.UpdatePersonalInfo,
);

router.get("/orders", isAuth, UserProfileController.getUserPaginatedOrders);
router.get("/GetWishlist", isAuth, UserProfileController.getUserWishlist);
router.post("/UpdateWishlist", isAuth, UserProfileController.updateUserWishlist);

module.exports = router;
