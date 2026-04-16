const fs = require("fs");
const path = require("path");
const Product = require("./models/product");
const { categories } = require("./data/categories");
const { app } = require("./config/env");
const { searchItems, getItem } = require("./services/ebay.service");
const { baseProductFromEbay } = require("./mappers/product.mapper");
const { Filter, hasCoreInfo } = require("./utils/Filter");
const FinalEnrichment = require("./mappers/FinalEnrichment");
const { connectDb, disconnectDb } = require("./services/db.service");
const Review = require("./models/Review");
const delay = require("./utils/delay");

async function collectCategoryProducts(category) {
  const results = [];
  const seen = new Set();
  let offset = 0;
  /**************************  collect items ***************************/
  while (offset < 500) {
    const page = await searchItems({
      query: category.keywords,
      limit: 50,
      offset,
    });
    const items = page?.itemSummaries || [];
    if (!items.length) break;

    for (const summary of items) {
      if (!summary?.itemId || seen.has(summary.itemId)) continue;
      //filter out duplicates and not appropriate categories
      const filterResult = Filter(summary, category.name);
      if (filterResult) seen.add(summary.itemId);
    }

    offset += 50;
  }
  /**************************  shuffle items ***************************/
  const arr = Array.from(seen);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const shuffled = new Set(arr);

  /**************************  get items details ***************************/
  for (const itemId of shuffled) {
    if (results.length >= app.perCategory) break;
    try {
      const item = await getItem(itemId);
      const product = await baseProductFromEbay(item, category.name);
      const productcheck = hasCoreInfo(product);
      if (!productcheck) {
        continue;
      }
      results.push(product);
      console.log(`[${category.name}] ${results.length}/${app.perCategory}`);
    } catch (error) {
      console.error(
        `[${category.name}] failed item ${itemId}:`,
        error?.response?.data || error.message,
      );
    }
  }

  // const outputDir = path.resolve(process.cwd(), app.outputDir_products);
  // fs.mkdirSync(outputDir, { recursive: true });
  // const outputPath = path.join(
  //   outputDir,
  //   `ebay-products-${category.name}.json`,
  // );
  // fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");

  return results;
}

async function saveProduct(product) {
  let created = 0;
  let updated = 0;

  // for (const product of products) {
  const existing = await Product.findOne({
    title: product.title,
    shortDescription: product.shortDescription,
  });

  if (existing) {
    await Product.updateOne({ _id: existing._id }, { $set: product });
    updated += 1;
  } else {
    await Product.create(product);
    created += 1;
  }
  // }

  return { created, updated };
}

async function saveReviews(productReviews) {
  // for (const review of reviews) {
  const product = await Product.findOne({ itemId: productReviews.productId });
  if (!product) {
    console.error(`Product ${productReviews.productId} not found`);
    return;
  }
  // console.log(`Saving review for ${product._id}`);
  for (const r of productReviews.Reviews) {
    // console.log(r);
    await Review.create({
      product: product._id,
      username: r.user,
      rating: r.rating,
      comment: r.comment,
      isApproved: true,
    });
  }
  // }
}

async function UpdateProductWithReviews(itemId) {
  const product = await Product.findOne({ itemId: itemId });
  // for (const product of products) {
  const reviews = await Review.find({ product: product._id });
  const reviewIds = reviews.map((review) => review._id);
  product.reviews = reviewIds;
  await product.save();
  // }
}

async function main() {
  const allProducts = [];
  const OutputPathes = new Map();
  await connectDb();

  for (const category of categories) {
    const categoryProducts = await collectCategoryProducts(category);
    allProducts.push(...categoryProducts);
    const outputDir = path.resolve(process.cwd(), app.outputDir_products);
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(
      outputDir,
      `ebay-products-${category.name}.json`,
    );
    OutputPathes.set(category.name, outputPath);
    if (allProducts.length >= app.totalProducts) break;
  }

  const ProductsBeforeEnrichment = allProducts.slice(0, app.totalProducts);

  for (let i = 0; i < ProductsBeforeEnrichment.length; i++) {
    const product = ProductsBeforeEnrichment[i];
    try {
      const { ProductWithEnrichment, aiReviews } =
        await FinalEnrichment(product);
      const outputPath = OutputPathes.get(product.sourceCategoryName);
      fs.appendFileSync(
        outputPath,
        JSON.stringify(
          { product: ProductWithEnrichment, reviews: aiReviews },
          null,
          2,
        ) + "\n",
        "utf8",
      );
      console.log(`Saved JSON -> ${outputPath}`);
      const saveResult = await saveProduct(ProductWithEnrichment);
      console.log(
        `MongoDB -> created: ${saveResult.created}, updated: ${saveResult.updated}`,
      );
      await saveReviews(aiReviews);
      await UpdateProductWithReviews(product.itemId);
      delay(2000);
    } catch (error) {
      console.error(
        `[ENRICHMENT] failed ${product.title}:`,
        error?.response?.data || error.message,
      );
    }
  }

  await disconnectDb();
}

main().catch(async (error) => {
  console.error("Fatal error:", error?.response?.data || error.message);
  try {
    await disconnectDb();
  } catch (e) {
    // ignore
  }
  process.exit(1);
});
