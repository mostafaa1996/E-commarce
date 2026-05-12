const express = require("express");
const router = express.Router();
const adminSettingsController = require("../controllers/adminSettings");
const isAuth = require("../MiddleWare/isauth");
const upload = require("../MiddleWare/upload");

router.get("/", isAuth, adminSettingsController.getAdminSettings);
router.put(
  "/profile",
  isAuth,
  upload.single("image"),
  adminSettingsController.updateAdminProfile,
);
router.put("/password", isAuth, adminSettingsController.updateAdminPassword);
router.put("/store", isAuth, adminSettingsController.updateAdminStore);
router.get("/TopBarInfo", isAuth, adminSettingsController.getTopBarInfo);

module.exports = router;
