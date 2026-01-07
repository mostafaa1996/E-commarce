// seedProducts.js
// const fs = require("fs");
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const categories = require("./categories");
const normalize = require("./normalize");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"));

const API_OPTIONS = {
  method: "GET",
  url: "https://real-time-amazon-data.p.rapidapi.com/search",
  headers: {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
  },
};

async function fetchCategory(category) {
  console.log(`Fetching ${category.name}...`);
  let page = 1;
  let collected = [];

  while (collected.length < 30) {
    const response = await axios.request({
      ...API_OPTIONS,
      params: {
        query: category.keywords,
        country: "US",
        page: String(page),
      },
    });

    const items = response.data?.data?.products || [];

    if (!items.length) break;

    collected.push(...items);

    page++;
    await delay(1200);
  }

  const products = collected
    .slice(0, 30)
    .map((item) => normalize.normalize(item, category.name));

  await Product.insertMany(products);
  console.log(`${products.length} products saved for ${category.name}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  try {
    await Product.deleteMany();
    console.log("Old products removed");

    for (const category of categories) {
      await fetchCategory(category);
    }

    // const Products_title = await Product.find().select("title -_id");
    // fs.writeFileSync("Products_title.json", JSON.stringify(Products_title));
    // console.log(Products_title);

    console.log("✅ 300 Products seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

exports.run = run;
