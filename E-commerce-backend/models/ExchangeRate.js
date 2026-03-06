const mongoose = require("mongoose");

const ExchangeRateSchema = new mongoose.Schema({
  baseCurrency: String,
  conversion_rates: Object,
  updatedAt: Date,
});

module.exports = mongoose.model("ExchangeRate", ExchangeRateSchema);
