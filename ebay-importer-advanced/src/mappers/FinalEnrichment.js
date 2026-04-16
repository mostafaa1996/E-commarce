const generateAIData = require("../services/ai.service");
const { variant_categories } = require("../data/categories");

let Pricing = {};
let Inventory = {};
let DefaultVariantId = null;
function safeParseAI(jsonString) {
  try {
    const cleaned = jsonString.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON parse failed");
    return null;
  }
}

function generateAllAttributesCombinations(attributes) {
  const keys = Object.keys(attributes).filter(
    (k) => Array.isArray(attributes[k]) && attributes[k].length > 0,
  );

  const result = [];

  function backtrack(index, current) {
    // base case
    if (index === keys.length) {
      result.push({ ...current });
      return;
    }

    const key = keys[index];
    const values = attributes[key];

    for (const value of values) {
      current[key] = value;
      backtrack(index + 1, current);
    }

    delete current[key];
  }

  backtrack(0, {});
  return result;
}
function generateVariants(attributes, product) {
  const combinations = generateAllAttributesCombinations(attributes);
  function generatePrice(price) {
    return price + Math.floor(Math.random() * 100);
  }
  function generateComapreAtPrice(price) {
    return price + Math.floor(Math.random() * 100);
  }
  function generateRondomStock() {
    return Math.floor(Math.random() * 200);
  }
  function generateRondomThreshold() {
    return Math.floor(Math.random() * 10);
  }
  const variants = combinations.map((c) => {
    return {
      id: product.itemId + "-" + Object.values(c).join("-"),
      sku: product.itemId + "-" + Object.values(c).join("-"),
      attributes: c,
      price: generatePrice(product.price),
      compareAtPrice: generateComapreAtPrice(product.price * 1.1),
      stock: generateRondomStock(),
      lowStockThreshold: generateRondomThreshold(),
      availabilityStatus: "IN_STOCK",
      isActive: true,
    };
  });
  Pricing = {
    minPrice: Math.min(...variants.map((v) => v.price)),
    maxPrice: Math.max(...variants.map((v) => v.price)),
  };
  Inventory = {
    totalStock: variants.reduce((acc, v) => acc + v.stock, 0),
  };
  DefaultVariantId = variants[0].id;
  return variants;
}

function hasVariants(str) {
  const keysOfVariant_categories = Object.keys(variant_categories);
  // console.log(keysOfVariant_categories, keysOfVariant_categories.includes(str));
  return keysOfVariant_categories.includes(str);
}

function normalizeAI(data) {
  if (!data) return null;

  return {
    tags: data.tags || [],

    attributes: {
      color: data.attributes?.colors || [],
      size: data.attributes?.sizes || [],
      storage: data.attributes?.storage || [],
      ram: data.attributes?.ram || [],
      ssd: data.attributes?.ssd || [],
    },

    reviewSummary: {
      averageRating: Number(data.reviewSummary?.averageRating || 0),
      reviewsCount: Number(data.reviewSummary?.reviewsCount || 0),
      ratingBreakdown: data.reviewSummary?.ratingBreakdown || {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      },
    },

    reviews: data.reviews || [],
  };
}

const FinalEnrichment = async (product) => {
  const raw = await generateAIData({
    title: product.title,
    description: product.shortDescription,
    specs: product.specifications,
    CategoryName: product.sourceCategoryName,
  });
  // console.log("Raw", raw);
  const parsed = safeParseAI(raw);
  const aiData = normalizeAI(parsed);

  // console.log("AI DATA", aiData);

  if (!aiData) return product;

  // console.log("Product", product);

  return {
    ProductWithEnrichment: {
      ...product,

      tags: aiData.tags,
      hasVariants: hasVariants(product.sourceCategoryName),

      variants: hasVariants(product.sourceCategoryName)
        ? generateVariants(aiData.attributes, product)
        : [
            {
              sku: `${product.itemId} - ${product.sourceCategoryName}`,

              attributes: {
                color: {
                  name: "",
                  hex: "",
                },
                size: "",
                storage: "",
                ram:  "",
                ssd: "",
              },

              price: product.price,
              compareAtPrice: product.price * 1.15 , // old price

              stock: 20,
              lowStockThreshold: 5 ,
              availabilityStatus: "IN_STOCK" ,

              isActive: true ,
            },
          ],

      reviewSummary: {
        averageRating: aiData.reviewSummary?.averageRating || 0,
        reviewsCount: aiData.reviewSummary?.reviewsCount || 0,
        ratingBreakdown: aiData.reviewSummary?.ratingBreakdown || {
          five: 0,
          four: 0,
          three: 0,
          two: 0,
          one: 0,
        },
        lastSyncedAt: new Date(),
      },

      reviews: [],

      status: "COMPLETED",

      pricing: Pricing,
      inventory: Inventory || { totalStock: 20 },
      defaultVariantId: DefaultVariantId || null,
    },
    aiReviews: { Reviews: aiData.reviews, productId: product.itemId },
  };
};

module.exports = FinalEnrichment;
