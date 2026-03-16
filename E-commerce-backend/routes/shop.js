const express = require("express"); 
const ShopController = require("../controllers/shop");
const isAuth = require("../MiddleWare/isauth"); 

const router = express.Router();

router.get("/", ShopController.getProducts);
router.get("/:id", ShopController.getProduct);
router.post("/:id/reviews", isAuth, ShopController.postReview);
router.get("/search/limited" , ShopController.getLimitedSearchProducts);

module.exports = router;