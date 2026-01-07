require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const jsonLds_method = require("./JsonLDs_method");
const HTML_fallback_method = require("./HTML_fallback_method");

mongoose.connect(process.env.MONGO_URI);

const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY;

async function scrapeProduct(url) {
  const response = await axios.get("https://api.zenrows.com/v1/", {
    params: {
      apikey: ZENROWS_API_KEY,
      url,
      js_render: "true",
      premium_proxy: "true"
    }
  });

  return response.data; // HTML
}

async function enrichProduct(product) {
  const html = await scrapeProduct(product.productUrl);
  const EnrichedProductByJsonLd = jsonLds_method.extractProductData(html);
  const EnrichedProductByHTMLFallback = HTML_fallback_method.extractFromHtml(html);
  const EnrichedProduct = mergeProductData(EnrichedProductByJsonLd, EnrichedProductByHTMLFallback);

  await Product.findByIdAndUpdate(product._id, {
    ...EnrichedProduct,
    status: "COMPLETE"
  });

  console.log(`Enriched: ${product.title}`);
}

async function run() {
  const products = await Product.find({ status: "PARTIAL" }).limit(20);

  for (const product of products) {
    await enrichProduct(product);
    await delay(2000); 
  }

  process.exit();
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function mergeProductData(jsonLdData, htmlData) {
  return {
    ...jsonLdData,

    images: jsonLdData.images?.length
      ? jsonLdData.images
      : htmlData.images,

    variants: jsonLdData.variants?.length
      ? jsonLdData.variants
      : htmlData.variants,

    sku: jsonLdData.sku || htmlData.sku,

    reviews: jsonLdData.reviews?.length
      ? jsonLdData.reviews
      : htmlData.reviews,

    reviewsCount:
      jsonLdData.reviewsCount || htmlData.reviewsCount ,

    additionalInfo: mergeAdditionalInfo(jsonLdData.additionalInfo, htmlData.additionalInfo)
  };
}

function mergeAdditionalInfo(jsonLdInfo = [], htmlInfo = []) {
  const map = new Map();

  [...jsonLdInfo, ...htmlInfo].forEach(item => {
    const key = item.key.toLowerCase();
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return [...map.values()];
}

run();

