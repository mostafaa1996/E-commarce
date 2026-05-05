require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/product");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const DEFAULT_CRITICAL_STOCK_THRESHOLD = 3;
const DEFAULT_LOW_STOCK_THRESHOLD = DEFAULT_CRITICAL_STOCK_THRESHOLD * 2;

function cleanSkuPart(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function colorPart(color) {
  if (!color) return "";

  if (typeof color === "string") {
    return cleanSkuPart(color);
  }

  return cleanSkuPart(color.hex || color.name);
}

function buildVariantSku(itemId, attributes = {}) {
  const parts = [
    cleanSkuPart(itemId),
    colorPart(attributes.color),
    cleanSkuPart(attributes.size),
    cleanSkuPart(attributes.storage),
    cleanSkuPart(attributes.ram),
  ].filter(Boolean);

  return parts.join("-");
}

function hasObjectObjectSkuBug(sku) {
  return String(sku || "")
    .toLowerCase()
    .includes("[object object]");
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const cursor = Product.find({}, { _id: 1, itemId: 1, variants: 1 })
    .lean()
    .cursor();

  let productsScanned = 0;
  let productsUpdated = 0;
  let variantsScanned = 0;
  let skusFixed = 0;
  let criticalStockThresholdsAdded = 0;
  let lowStockThresholdsFixed = 0;
  let variantUpdatedAtSet = 0;

  for await (const product of cursor) {
    productsScanned++;

    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0 ||
      product.hasVariants === false
    ) {
      continue;
    }

    let productChanged = false;
    const now = new Date();

    const variants = product.variants.map((variant) => {
      variantsScanned++;

      const nextVariant = { ...variant };

      // if (hasObjectObjectSkuBug(nextVariant.sku)) {
      //   const fixedSku = buildVariantSku(product.itemId, nextVariant.attributes);

      //   if (fixedSku && fixedSku !== nextVariant.sku) {
      //     nextVariant.sku = fixedSku;
      //     skusFixed++;
      //     productChanged = true;
      //   }
      // }

      // if (
      //   nextVariant.criticalStockThreshold === undefined ||
      //   nextVariant.criticalStockThreshold === null
      // ) {
      //   nextVariant.criticalStockThreshold = DEFAULT_CRITICAL_STOCK_THRESHOLD;
      //   criticalStockThresholdsAdded++;
      //   productChanged = true;
      // }

      if (
        nextVariant.lowStockThreshold === undefined ||
        nextVariant.lowStockThreshold === null ||
        nextVariant.lowStockThreshold < DEFAULT_CRITICAL_STOCK_THRESHOLD
      ) {
        nextVariant.lowStockThreshold = DEFAULT_LOW_STOCK_THRESHOLD;
        lowStockThresholdsFixed++;
        productChanged = true;
      }

      // nextVariant.updatedAt = randomDateBetween(oneYearAgo, now);
      // variantUpdatedAtSet++;
      // productChanged = true;

      return nextVariant;
    });

    if (!productChanged) continue;

    const result = await Product.updateOne(
      { _id: product._id },
      { $set: { variants } },
      { strict: false },
    );

    if (result.modifiedCount > 0) {
      productsUpdated++;
    }
  }

  console.log("Done.");
  console.log(`Products scanned: ${productsScanned}`);
  console.log(`Products updated: ${productsUpdated}`);
  console.log(`Variants scanned: ${variantsScanned}`);
  console.log(`Variant SKUs fixed: ${skusFixed}`);
  console.log(
    `criticalStockThreshold fields added: ${criticalStockThresholdsAdded}`,
  );
  console.log(`lowStockThreshold fields fixed: ${lowStockThresholdsFixed}`);
  console.log(`Variant updatedAt fields set: ${variantUpdatedAtSet}`);
}

main()
  .catch((error) => {
    console.error("Failed to fix variant SKUs and stock metadata:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
