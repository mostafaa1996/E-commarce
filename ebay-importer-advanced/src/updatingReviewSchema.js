require("dotenv").config();

const mongoose = require("mongoose");
const Review = require("./models/Review");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const TARGET_REJECTED_COUNT = 3;
const TARGET_PENDING_COUNT = 4;

function shuffle(items) {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const statusEnum = Review.schema.path("status").enumValues;
  const pendingStatus = statusEnum.find((value) => value === "pending");
  const approvedStatus = statusEnum.find((value) => value === "approved");
  const rejectedStatus = statusEnum.find((value) => value === "rejected");

  if (!pendingStatus || !approvedStatus || !rejectedStatus) {
    throw new Error(
      `Review status enum is invalid. Found: ${JSON.stringify(statusEnum)}`,
    );
  }

  const reviews = await Review.find({}, { _id: 1 }).lean();
  console.log(`Found ${reviews.length} reviews.`);

  if (!reviews.length) {
    console.log("No reviews found.");
    return;
  }

  const shuffledReviews = shuffle(reviews);
  const rejectedCount = Math.min(TARGET_REJECTED_COUNT, shuffledReviews.length);
  const pendingCount = Math.min(
    TARGET_PENDING_COUNT,
    Math.max(shuffledReviews.length - rejectedCount, 0),
  );

  const rejectedIds = new Set(
    shuffledReviews.slice(0, rejectedCount).map((review) => String(review._id)),
  );
  const pendingIds = new Set(
    shuffledReviews
      .slice(rejectedCount, rejectedCount + pendingCount)
      .map((review) => String(review._id)),
  );

  const bulkUpdates = shuffledReviews.map((review) => {
    let status = approvedStatus;

    if (rejectedIds.has(String(review._id))) {
      status = rejectedStatus;
    } else if (pendingIds.has(String(review._id))) {
      status = pendingStatus;
    }

    return {
      updateOne: {
        filter: { _id: review._id },
        update: {
          $set: { status },
          $unset: { isApproved: "" },
        },
      },
    };
  });

  const result = await Review.bulkWrite(bulkUpdates);

  console.log("Done.");
  console.log(`Matched reviews: ${result.matchedCount}`);
  console.log(`Modified reviews: ${result.modifiedCount}`);
  console.log(`Rejected reviews set: ${rejectedCount}`);
  console.log(`Pending reviews set: ${pendingCount}`);
  console.log(
    `Approved reviews set: ${reviews.length - rejectedCount - pendingCount}`,
  );
}

main()
  .catch((error) => {
    console.error("Failed to update review schema:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
