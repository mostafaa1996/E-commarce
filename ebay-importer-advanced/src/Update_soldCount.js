require("dotenv").config();

const mongoose = require("mongoose");

const Order = require("./models/Order");
const Product = require("./models/product");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const COUNTABLE_ORDER_STATUSES = ["paid", "orderPlaced"];
const COUNTABLE_PAYMENT_STATUSES = ["succeeded"];

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const salesByProduct = await Order.aggregate([
    {
      $match: {
        status: { $in: COUNTABLE_ORDER_STATUSES },
        paymentStatus: { $in: COUNTABLE_PAYMENT_STATUSES },
      },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        soldCount: { $sum: "$orderItems.quantity" },
      },
    },
  ]);

  const bulkUpdates = salesByProduct.map((entry) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: {
        $set: {
          soldCount: entry.soldCount,
        },
      },
    },
  }));

  if (bulkUpdates.length) {
    await Product.bulkWrite(bulkUpdates);
  }

  const countedProductIds = salesByProduct.map((entry) => entry._id);
  const zeroResult = await Product.updateMany(
    countedProductIds.length
      ? { _id: { $nin: countedProductIds }, soldCount: { $ne: 0 } }
      : { soldCount: { $ne: 0 } },
    { $set: { soldCount: 0 } },
  );

  const totalUnitsSold = salesByProduct.reduce(
    (sum, entry) => sum + entry.soldCount,
    0,
  );

  console.log(`Updated soldCount for ${salesByProduct.length} products.`);
  console.log(`Reset soldCount to 0 for ${zeroResult.modifiedCount} products.`);
  console.log(`Total sold units counted: ${totalUnitsSold}.`);
  console.log(
    `Counted orders with status in [${COUNTABLE_ORDER_STATUSES.join(", ")}] and paymentStatus in [${COUNTABLE_PAYMENT_STATUSES.join(", ")}].`,
  );
}

main()
  .catch((error) => {
    console.error("Failed to update product soldCount:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
