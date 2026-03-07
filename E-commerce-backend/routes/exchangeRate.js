const express = require("express");
const router = express.Router();
const exchangeRateController = require("../controllers/exchangeRate");

router.get("/", exchangeRateController.getExchangeRate);

module.exports = router;