const express = require("express"); 
const ShopController = require("../controllers/shop");

const router = express.Router();

router.get("/", ShopController.getProducts);
router.get("/:id", ShopController.getProduct);
router.get("/search/limited" , ShopController.getLimitedSearchProducts);

module.exports = router;