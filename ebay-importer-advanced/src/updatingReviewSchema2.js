require("dotenv").config();

const mongoose = require("mongoose");
const Review = require("./models/Review");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const USERNAME_ADJECTIVES = [
  "happy",
  "smart",
  "swift",
  "bright",
  "calm",
  "bold",
  "cool",
  "kind",
  "lucky",
  "mellow",
];

const USERNAME_NOUNS = [
  "buyer",
  "shopper",
  "reviewer",
  "collector",
  "explorer",
  "hunter",
  "fan",
  "visitor",
  "member",
  "customer",
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomUsername() {
  const adjective = randomItem(USERNAME_ADJECTIVES);
  const noun = randomItem(USERNAME_NOUNS);
  const suffix = Math.floor(100 + Math.random() * 900);

  return `${adjective}${noun}${suffix}`;
}

function randomDate(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime =
    startTime + Math.floor(Math.random() * (endTime - startTime + 1));

  return new Date(randomTime);
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const reviews = await Review.collection
    .find({}, { projection: { _id: 1, user: 1, username: 1, date: 1 } })
    .toArray();
  console.log(`Found ${reviews.length} reviews.`);

  if (!reviews.length) {
    console.log("No reviews found.");
    return;
  }

  const startDate = new Date("2022-01-01T00:00:00.000Z");
  const endDate = new Date();

  let missingDateCount = 0;
  let missingUsernameCount = 0;

  const bulkUpdates = reviews.map((review) => {
    const set = {
      verified: Boolean(review.user),
    };

    if (!review.date) {
      set.date = randomDate(startDate, endDate);
      missingDateCount += 1;
    }

    if (!review.username) {
      set.username = randomUsername();
      missingUsernameCount += 1;
    }

    return {
      updateOne: {
        filter: { _id: review._id },
        update: {
          $set: set,
          $unset: { isApproved: "" },
        },
      },
    };
  });

  const result = await Review.collection.bulkWrite(bulkUpdates);

  console.log("Done.");
  console.log(`Matched reviews: ${result.matchedCount}`);
  console.log(`Modified reviews: ${result.modifiedCount}`);
  console.log(`Dates added: ${missingDateCount}`);
  console.log(`Usernames added: ${missingUsernameCount}`);
}

main()
  .catch((error) => {
    console.error("Failed to update review schema:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
