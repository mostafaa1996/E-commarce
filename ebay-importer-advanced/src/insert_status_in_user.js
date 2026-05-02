require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const BLOCKED_USERS_COUNT = 3;
const INACTIVE_USERS_COUNT = 5;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const usersWithoutStatus = await User.find(
    { status: { $exists: false } },
    { _id: 1 },
  )
    .sort({ _id: 1 })
    .lean();

  console.log(`Found ${usersWithoutStatus.length} users without status.`);

  if (!usersWithoutStatus.length) {
    console.log("No users need status updates.");
    return;
  }

  const bulkUpdates = usersWithoutStatus.map((user, index) => {
    let status = "active";

    if (index < BLOCKED_USERS_COUNT) {
      status = "blocked";
    } else if (index < BLOCKED_USERS_COUNT + INACTIVE_USERS_COUNT) {
      status = "inactive";
    }

    return {
      updateOne: {
        filter: { _id: user._id, status: { $exists: false } },
        update: { $set: { status } },
      },
    };
  });

  const result = await User.bulkWrite(bulkUpdates, { ordered: false });

  console.log(`Matched users: ${result.matchedCount}`);
  console.log(`Modified users: ${result.modifiedCount}`);
  console.log(`Set blocked users: ${Math.min(BLOCKED_USERS_COUNT, usersWithoutStatus.length)}`);
  console.log(
    `Set inactive users: ${Math.min(
      INACTIVE_USERS_COUNT,
      Math.max(usersWithoutStatus.length - BLOCKED_USERS_COUNT, 0),
    )}`,
  );
  console.log(
    `Set active users: ${Math.max(
      usersWithoutStatus.length - BLOCKED_USERS_COUNT - INACTIVE_USERS_COUNT,
      0,
    )}`,
  );
}

main()
  .catch((error) => {
    console.error("Failed to insert user statuses:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
