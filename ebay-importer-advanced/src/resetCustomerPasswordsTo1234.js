require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const CUSTOMER_ROLE = "customer";
const NEW_PASSWORD = "1234";

// This bcrypt hash verifies when the user enters NEW_PASSWORD at login.
// MongoDB must store this hash, not the plain text password.
const NEW_PASSWORD_HASH =
  process.env.CUSTOMER_RESET_PASSWORD_HASH ||
  "$2a$10$Jr8A352R8VZcfnN/SP5vCubnL2TZSUm4FSNioawR.VZ5X7i2kvldu";

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const filter = { role: CUSTOMER_ROLE };
  const customersCount = await User.countDocuments(filter);

  if (customersCount === 0) {
    console.log("No customer users found. Nothing changed.");
    return;
  }

  const result = await User.updateMany(filter, {
    $set: { password: NEW_PASSWORD_HASH },
  });

  console.log("Done.");
  console.log(`Password set for role: ${CUSTOMER_ROLE}`);
  console.log(`Users can now login with password: ${NEW_PASSWORD}`);
  console.log(`MongoDB stored password hash: ${NEW_PASSWORD_HASH}`);
  console.log(`Customers found: ${customersCount}`);
  console.log(`Users matched: ${result.matchedCount}`);
  console.log(`Users modified: ${result.modifiedCount}`);
}

main()
  .catch((error) => {
    console.error("Failed to reset customer passwords:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
