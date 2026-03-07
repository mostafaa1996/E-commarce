const ExchangeRate = require("../models/ExchangeRate");
exports.getExchangeRate = async (req, res, next) => {
  try {
    const data = await ExchangeRate.findOne({
      baseCurrency: "USD",
    }).select("conversion_rates");
    if (!data) return res.status(401).json({ message: "Exchange rates not found" });
    const conversion_rates = data?.conversion_rates;
    const reqRates = {
        EGP: conversion_rates?.EGP,
        EUR: conversion_rates?.EUR,
        USD: conversion_rates?.USD,
    }
    res.status(200).json(reqRates);
  } catch (err) {
    next(err);
  }
};
