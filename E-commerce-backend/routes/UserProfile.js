const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/UserProfile");
const isAuth = require("../MiddleWare/isauth");
const upload = require("../middleware/upload");
const {
  ValidatePersonalInfo,
} = require("../Validation/UpdatePersonalInfoValidator");
const { ValidateUserAddress } = require("../Validation/UpdateUserAddress");
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
router.post(
  "/UpdateWishlist",
  isAuth,
  UserProfileController.updateUserWishlist,
);
router.post(
  "/updateAddress",
  isAuth,
  ValidateUserAddress,
  isValid,
  UserProfileController.updateUserAddress,
);
router.put(
  "/updateAddress/:id",
  isAuth,
  ValidateUserAddress,
  isValid,
  UserProfileController.updateUserAddress,
);
router.delete(
  "/deleteAddress/:id",
  isAuth,
  UserProfileController.deleteUserAddress,
);
router.get("/addresses", isAuth, UserProfileController.getUserAddresses);
router.put("/SetAddressToDefault/:id", isAuth, UserProfileController.setAddressToDefault);

module.exports = router;
