const express = require("express");
const router = express.Router();
const adminReviewsController = require("../controllers/adminReviews");
const isAuth = require("../MiddleWare/isauth");

router.get("/", isAuth, adminReviewsController.getAdminProductsReviews);
router.put("/:id", isAuth, adminReviewsController.updateReviewStatus);
router.delete("/:id", isAuth, adminReviewsController.deleteReview);

module.exports = router;