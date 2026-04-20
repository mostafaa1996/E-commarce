// migrate-products-reviews.js
// Usage:
//   MONGODB_URI="mongodb://127.0.0.1:27017" DB_NAME="your_db_name" node migrate-products-reviews.js
//
// What it does:
// 1) Reads the 5 corrected files you generated earlier
// 2) Updates products.variants[].sku and products.variants[].id from those files
// 3) Sets products.defaultVariantId = products.variants[0]._id
// 4) Updates reviews with username/date/verified and removes createdAt/updatedAt
//
// Assumptions:
// - products collection has: { _id, itemId, variants: [...] }
// - each variant subdocument already has its own MongoDB _id
// - reviews collection has: { product: ObjectId, rating, comment, ... }
// - source files structure is based on your generated output files
// - review matching is done by: product + rating + comment

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const Review = require("./models/Review");

const MONGODB_URI = process.env.MONGODB_URI ;
const DB_NAME = process.env.DB_NAME;

const SOURCE_FILES = [
  "ebay-products-Headphones-corrected.json",
  "ebay-products-Laptops-corrected.json",
  "ebay-products-Smart Watches-corrected.json",
  "ebay-products-Smartphones-corrected.json",
  "ebay-products-Tablets-corrected.json",
];

// ---------- Helpers ----------
function parseConcatenatedJsonObjects(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const objects = [];
  let i = 0;

  while (i < text.length) {
    while (i < text.length && /\s/.test(text[i])) i++;
    if (i >= text.length) break;

    let start = i;
    let inString = false;
    let escaped = false;
    let depth = 0;
    let foundStart = false;

    for (; i < text.length; i++) {
      const ch = text[i];

      if (!foundStart) {
        if (ch === "{") {
          foundStart = true;
          depth = 1;
        }
        continue;
      }

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === "\\") {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const raw = text.slice(start, i + 1);
          objects.push(JSON.parse(raw));
          i++;
          break;
        }
      }
    }
  }

  return objects;
}

function normalizeComment(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSourceMaps(baseDir) {
  const productMap = new Map(); // itemId -> { variants: [...] }
  const reviewMap = new Map();  // itemId -> [{ rating, comment, username, date }]

  for (const file of SOURCE_FILES) {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing source file: ${fullPath}`);
    }

    const records = parseConcatenatedJsonObjects(fullPath);

    for (const record of records) {
      if (!record || !record.product || !record.product.itemId) continue;

      const itemId = record.product.itemId;

      if (Array.isArray(record.product.variants)) {
        productMap.set(itemId, {
          variants: record.product.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
          })),
        });
      }

      const reviews = record.reviews?.Reviews;
      if (Array.isArray(reviews)) {
        reviewMap.set(
          itemId,
          reviews.map((r) => ({
            rating: Number(r.rating),
            comment: normalizeComment(r.comment),
            username: r.username || "",
            date: r.date ? new Date(`${r.date}T00:00:00.000Z`) : null,
          }))
        );
      }
    }
  }

  return { productMap, reviewMap };
}

// ---------- Main ----------
async function run() {
  const baseDir = path.join(__dirname, "..", "output", "products");
  const { productMap, reviewMap } = buildSourceMaps(baseDir);

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

    console.log(`Connected to ${DB_NAME}`);
    console.log(`Loaded ${productMap.size} products and ${reviewMap.size} review groups from files.`);

    // 1) Update product variants sku/id + defaultVariantId
    let productUpdated = 0;
    let productMissing = 0;
    let defaultVariantUpdated = 0;
    let defaultVariantSkipped = 0;

    for (const [itemId, sourceProduct] of productMap.entries()) {
      const dbProduct = await Product.findOne(
        { itemId },
        { _id: 1, itemId: 1, variants: 1, defaultVariantId: 1 }
      ).lean();

      if (!dbProduct) {
        productMissing++;
        console.warn(`Product not found for itemId: ${itemId}`);
        continue;
      }

      if (!Array.isArray(dbProduct.variants) || dbProduct.variants.length === 0) {
        defaultVariantSkipped++;
        console.warn(`No variants found in DB for product itemId: ${itemId}`);
        continue;
      }

      if (!Array.isArray(sourceProduct.variants) || sourceProduct.variants.length === 0) {
        defaultVariantSkipped++;
        console.warn(`No source variants found in file for product itemId: ${itemId}`);
        continue;
      }

      // Keep every field unchanged except id/sku
      const updatedVariants = dbProduct.variants.map((dbVariant, idx) => {
        const srcVariant = sourceProduct.variants[idx];
        if (!srcVariant) return dbVariant;

        return {
          ...dbVariant,
          id: srcVariant.id,
          sku: srcVariant.sku,
        };
      });

      const firstVariantObjectId = updatedVariants[0]?._id || dbProduct.variants[0]?._id;

      const updateDoc = {
        $set: {
          variants: updatedVariants,
        },
      };

      if (firstVariantObjectId) {
        updateDoc.$set.defaultVariantId = String(firstVariantObjectId);
      }

      const result = await Product.updateOne(
        { _id: dbProduct._id },
        updateDoc,
        { strict: false }
      );

      if (result.modifiedCount > 0) {
        productUpdated++;
      }

      if (firstVariantObjectId) {
        defaultVariantUpdated++;
      } else {
        defaultVariantSkipped++;
      }
    }

    // Build product itemId -> _id lookup for review updates
    const itemIds = [...reviewMap.keys()];
    const products = await Product.find(
      { itemId: { $in: itemIds } },
      { _id: 1, itemId: 1 }
    ).lean();

    const productIdByItemId = new Map(products.map((p) => [p.itemId, p._id]));

    // 2) Update reviews with username/date/verified and remove createdAt/updatedAt
    let reviewMatched = 0;
    let reviewUpdated = 0;
    let reviewNotFound = 0;

    for (const [itemId, sourceReviews] of reviewMap.entries()) {
      const productObjectId = productIdByItemId.get(itemId);

      if (!productObjectId) {
        console.warn(`Skipping reviews; product not found for itemId: ${itemId}`);
        continue;
      }

      for (const src of sourceReviews) {
        const filter = {
          product: productObjectId,
          rating: src.rating,
          comment: { $regex: `^${escapeRegex(src.comment)}$`, $options: "i" },
        };

        const update = {
          $set: {
            username: src.username,
            date: src.date,
            verified: true,
          },
        };

        const result = await Review.updateOne(filter, update, { strict: false });

        if (result.matchedCount > 0) reviewMatched++;
        if (result.modifiedCount > 0) reviewUpdated++;

        if (result.matchedCount === 0) {
          reviewNotFound++;
          console.warn(
            `Review not found for itemId=${itemId}, rating=${src.rating}, comment=${src.comment.slice(0, 60)}...`
          );
        }
      }
    }

    // Optional final cleanup on all reviews
    // const cleanupResult = await Review.updateMany(
    //   {},
    //   {
    //     $set: {
    //       verified: true,
    //     },
    //   },
    //   { strict: false }
    // );

    console.log("\nDone.");
    console.log(`Products updated: ${productUpdated}`);
    console.log(`Products missing in DB: ${productMissing}`);
    console.log(`defaultVariantId updated: ${defaultVariantUpdated}`);
    console.log(`defaultVariantId skipped: ${defaultVariantSkipped}`);
    console.log(`Reviews matched: ${reviewMatched}`);
    console.log(`Reviews updated: ${reviewUpdated}`);
    console.log(`Reviews not found by product+rating+comment: ${reviewNotFound}`);
    console.log(`Final review cleanup modified: ${cleanupResult.modifiedCount}`);
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  console.error("Migration failed:");
  console.error(err);
  process.exit(1);
});
