require("dotenv").config();

const mongoose = require("mongoose");

const Category = require("./models/Category");
const Product = require("./models/product");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const categories = await Category.find({}, { _id: 1, name: 1 }).lean();

  if (categories.length === 0) {
    console.log("No categories found. Nothing changed.");
    return;
  }

  const productsByCategory = await Product.aggregate([
    {
      $match: {
        category: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$category",
        productIds: { $addToSet: "$_id" },
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryIds = new Set(
    categories.map((category) => category._id.toString()),
  );
  const productsByCategoryId = new Map(
    productsByCategory.map((entry) => [entry._id.toString(), entry]),
  );

  const bulkUpdates = categories.map((category) => {
    const categoryId = category._id.toString();
    const matchedProducts = productsByCategoryId.get(categoryId);

    return {
      updateOne: {
        filter: { _id: category._id },
        update: {
          $set: {
            attachedProducts: matchedProducts?.productIds || [],
          },
        },
      },
    };
  });

  const result = await Category.bulkWrite(bulkUpdates);

  const invalidCategoryGroups = productsByCategory.filter(
    (entry) => !categoryIds.has(entry._id.toString()),
  );
  const attachedProductsCount = productsByCategory.reduce((sum, entry) => {
    if (!categoryIds.has(entry._id.toString())) {
      return sum;
    }

    return sum + entry.productIds.length;
  }, 0);
  const emptyCategoriesCount = categories.filter(
    (category) => !productsByCategoryId.has(category._id.toString()),
  ).length;

  console.log("Done.");
  console.log(`Categories checked: ${categories.length}`);
  console.log(`Categories updated: ${result.modifiedCount}`);
  console.log(`Product references attached: ${attachedProductsCount}`);
  console.log(`Categories with no matching products: ${emptyCategoriesCount}`);

  if (invalidCategoryGroups.length > 0) {
    const invalidProductsCount = invalidCategoryGroups.reduce(
      (sum, entry) => sum + entry.count,
      0,
    );

    console.log(
      `Products skipped because their category id does not exist: ${invalidProductsCount}`,
    );
  }
}

main()
  .catch((error) => {
    console.error("Failed to attach products to categories:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
