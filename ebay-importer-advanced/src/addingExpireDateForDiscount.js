require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/product");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const MAX_MONTHS_AHEAD = 4;

function randomExpireDateWithinFourMonths() {
  const now = new Date();
  const maxDate = new Date(now);
  maxDate.setMonth(maxDate.getMonth() + MAX_MONTHS_AHEAD);

  const minTime = now.getTime();
  const maxTime = maxDate.getTime();
  const randomTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

  return new Date(randomTime);
}

function hasActiveDiscount(variant) {
  const price = Number(variant?.price || 0);
  const compareAtPrice = Number(variant?.compareAtPrice || 0);

  return compareAtPrice > price && price > 0;
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const cursor = Product.find({}, { _id: 1, variants: 1 }).lean().cursor();

  let productsScanned = 0;
  let productsUpdated = 0;
  let variantsScanned = 0;
  let expireDatesAdded = 0;

  for await (const product of cursor) {
    productsScanned++;

    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      continue;
    }

    let productChanged = false;
    const variants = product.variants.map((variant) => {
      variantsScanned++;

      if (!hasActiveDiscount(variant) || variant.expireDate) {
        return variant;
      }

      productChanged = true;
      expireDatesAdded++;

      return {
        ...variant,
        expireDate: randomExpireDateWithinFourMonths(),
      };
    });

    if (!productChanged) {
      continue;
    }

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
  console.log(`Expire dates added: ${expireDatesAdded}`);
}

main()
  .catch((error) => {
    console.error("Failed to add expire dates for discounted variants:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
