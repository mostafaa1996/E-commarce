const cron = require("node-cron");
const axios = require("axios");
const ExchangeRate = require("../models/ExchangeRate");
require("dotenv").config();

const EXCHANGE_RATE_API_URL = process.env.EXCHANGE_RATE_API_URL;

const updateRates = async () => {
  const res = await axios.get(
    EXCHANGE_RATE_API_URL
  );

  const rates = res.data.conversion_rates;

  await ExchangeRate.updateOne(
    { baseCurrency: "USD" },
    { conversion_rates: rates, updatedAt: new Date() },
    { upsert: true }
  );

  console.log("Exchange rates updated");
}

// updateRates();

cron.schedule("0 0 */1 * *", updateRates);