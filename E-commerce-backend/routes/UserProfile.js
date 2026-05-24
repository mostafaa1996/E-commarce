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
  "/updatePersonalInfo",
  isAuth,
  upload.single("avatar"),
  ValidatePersonalInfo,
  isValid,
  UserProfileController.UpdatePersonalInfo,
);

router.get("/orders", isAuth, UserProfileController.getUserOrders);
router.get("/GetWishlist", isAuth, UserProfileController.getUserWishlist);
router.post(
  "/UpdateWishlist",
  isAuth,
  UserProfileController.updateUserWishlist,
);
router.delete("/clearWishlist", isAuth, UserProfileController.clearWishlist);
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
