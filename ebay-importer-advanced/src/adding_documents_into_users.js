require("dotenv").config();

const mongoose = require("mongoose");

const Order = require("./models/Order");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const orderTotalsByUser = await Order.aggregate([
    {
      $group: {
        _id: "$userId",
        totalSpent: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  console.log(`Found orders for ${orderTotalsByUser.length} users.`);

  const resetResult = await User.updateMany(
    {},
    {
      $set: {
        totalSpent: 0,
        totalOrders: 0,
      },
    },
  );

  console.log(`Reset totals for ${resetResult.modifiedCount} users.`);

  if (!orderTotalsByUser.length) {
    console.log("No orders found. All users now have zero totals.");
    return;
  }

  const bulkUpdates = orderTotalsByUser.map((userTotals) => ({
    updateOne: {
      filter: { _id: userTotals._id },
      update: {
        $set: {
          totalSpent: userTotals.totalSpent,
          totalOrders: userTotals.totalOrders,
        },
      },
    },
  }));

  const result = await User.bulkWrite(bulkUpdates);
  console.log(`Updated totals for ${result.modifiedCount} users.`);
}

main()
  .catch((error) => {
    console.error("Failed to add order totals into users:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
