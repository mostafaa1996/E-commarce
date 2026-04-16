require("dotenv").config();

module.exports = {
  ebay: {
    clientId: process.env.EBAY_CLIENT_ID,
    clientSecret: process.env.EBAY_CLIENT_SECRET,
    marketplaceId: process.env.EBAY_MARKETPLACE_ID || "EBAY_US"
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-5-mini"
  },
  scraperapi: {
    apiKey: process.env.SCRAPERAPI_API_KEY
  },
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  app: {
    totalProducts: Number(process.env.TOTAL_PRODUCTS || 400),
    perCategory: Number(process.env.PER_CATEGORY || 40),
    ebayDelayMs: Number(process.env.EBAY_DELAY_MS || 500),
    scrapingDelayMs: Number(process.env.SCRAPING_DELAY_MS || 2500),
    outputDir_products: process.env.OUTPUT_DIR_PRODUCTS || "output/products",
    outputDir_reviews: process.env.OUTPUT_DIR_REVIEWS || "output/reviews",
  },
};
