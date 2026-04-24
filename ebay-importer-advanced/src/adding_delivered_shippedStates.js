require("dotenv").config();

const mongoose = require("mongoose");

const Order = require("./models/Order");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const VALID_STATUS_PAYMENT_COMBINATIONS = [
  { status: "pending", paymentStatus: "pending" },
  { status: "processing", paymentStatus: "pending" },
  { status: "orderPlaced", paymentStatus: "paid" },
  { status: "shipped", paymentStatus: "paid" },
  { status: "delivered", paymentStatus: "paid" },
  { status: "cancelled", paymentStatus: "pending" },
  { status: "returned", paymentStatus: "pending" },
  { status: "returned", paymentStatus: "refunded" },
  { status: "pending", paymentStatus: "not_required" },
  { status: "processing", paymentStatus: "not_required" },
  { status: "orderPlaced", paymentStatus: "not_required" },
  { status: "shipped", paymentStatus: "not_required" },
  { status: "delivered", paymentStatus: "not_required" },
];

function getRandomValue(values) {
  return values[Math.floor(Math.random() * values.length)];
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const orders = await Order.find({}, { _id: 1, status: 1, paymentStatus: 1 }).lean();

  console.log(`Found ${orders.length} orders.`);

  if (!orders.length) {
    console.log("No orders found.");
    return;
  }

  const bulkUpdates = orders.map((order) => {
    const nextOrderState = getRandomValue(VALID_STATUS_PAYMENT_COMBINATIONS);

    return {
      updateOne: {
        filter: { _id: order._id },
        update: {
          $set: {
            status: nextOrderState.status,
            paymentStatus: nextOrderState.paymentStatus,
          },
        },
      },
    };
  });

  const result = await Order.bulkWrite(bulkUpdates);
  console.log(`Modified orders: ${result.modifiedCount}`);
}

main()
  .catch((error) => {
    console.error("Failed to randomize order statuses:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
