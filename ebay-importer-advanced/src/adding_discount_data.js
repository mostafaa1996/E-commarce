require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/product");
const Discount = require("./models/Discount");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const MIN_DISCOUNT_EXPIRY_DAYS = 7;
const MAX_DISCOUNT_EXPIRY_DAYS = 45;

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function randomCompareAtPriceAbove(price) {
  const numericPrice = Number(price || 0);
  const minIncrease = Math.max(1, Math.ceil(numericPrice * 0.05));
  const maxIncrease = Math.max(minIncrease, Math.ceil(numericPrice * 0.25));
  const randomIncrease =
    Math.floor(Math.random() * (maxIncrease - minIncrease + 1)) + minIncrease;

  return toMoney(numericPrice + randomIncrease);
}

function randomExpireDate() {
  const minMs = MIN_DISCOUNT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const maxMs = MAX_DISCOUNT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const randomMs =
    Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

  return new Date(Date.now() + randomMs);
}

function buildDiscountData(product, variant) {
  const price = toMoney(variant.price);
  const compareAtPrice = toMoney(variant.compareAtPrice);
  const rawDiscountAmount = Math.max(compareAtPrice - price, 0);
  const percentage =
    compareAtPrice > 0 ? (rawDiscountAmount / compareAtPrice) * 100 : 0;

  return {
    productId: product._id,
    variantId: variant._id,
    title: `${product.title}`,
    sku: variant.sku || "",
    type: "PERCENTAGE",
    value: toMoney(percentage),
    expireDate: randomExpireDate(),
    price,
    compareAtPrice,
    status: "ACTIVE",
  };
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const cursor = Product.find(
    {},
    { _id: 1, title: 1, hasVariants: 1, variants: 1 },
  )
    .lean()
    .cursor();

  let productsScanned = 0;
  let productsUpdated = 0;
  let variantsScanned = 0;
  let compareAtPricesFixed = 0;
  let discountsUpserted = 0;

  for await (const product of cursor) {
    productsScanned++;

    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      continue;
    }

    let productChanged = false;
    const variants = product.variants.map((variant) => {
      variantsScanned++;

      const nextVariant = { ...variant };
      const price = Number(nextVariant.price || 0);
      const compareAtPrice = Number(nextVariant.compareAtPrice || 0);

      if (compareAtPrice > 0 && compareAtPrice < price) {
        nextVariant.compareAtPrice = randomCompareAtPriceAbove(price);
        productChanged = true;
        compareAtPricesFixed++;
      }

      return nextVariant;
    });

    if (productChanged) {
      const result = await Product.updateOne(
        { _id: product._id },
        { $set: { variants } },
        { strict: false },
      );

      if (result.modifiedCount > 0) {
        productsUpdated++;
      }
    }

    for (const variant of variants) {
      const compareAtPrice = Number(variant.compareAtPrice || 0);

      if (compareAtPrice <= 0) {
        continue;
      }

      const discountData = buildDiscountData(product, variant);

      await Discount.updateOne(
        { productId: product._id, variantId: variant._id },
        { $set: discountData },
        { upsert: true },
      );

      discountsUpserted++;
    }
  }

  console.log("Done.");
  console.log(`Products scanned: ${productsScanned}`);
  console.log(`Products updated: ${productsUpdated}`);
  console.log(`Variants scanned: ${variantsScanned}`);
  console.log(`compareAtPrice values fixed: ${compareAtPricesFixed}`);
  console.log(`Discount documents upserted: ${discountsUpserted}`);
}

main()
  .catch((error) => {
    console.error("Failed to add discount data:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
