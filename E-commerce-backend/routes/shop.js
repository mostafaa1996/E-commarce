const express = require("express"); 
const ShopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", ShopController.getProducts);
router.get("/products/:id", ShopController.getProduct);

module.exports = router;