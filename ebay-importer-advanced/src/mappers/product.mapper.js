const slugify = require("../utils/slugify");
const { stripHtml, truncate } = require("../utils/text");
const Category = require("../models/Category");

function uniqSpecs(specs = []) {
  const map = new Map();
  for (const spec of specs) {
    const key = `${spec.key}::${spec.value}`;
    if (!map.has(key)) map.set(key, spec);
  }
  return [...map.values()];
}

function mapSpecifications(item) {
  const specs = [];
  for (const aspect of item.localizedAspects || []) {
    if (aspect?.name && Array.isArray(aspect.value)) {
      specs.push({ key: aspect.name, value: aspect.value.join(", ") });
    } else if (aspect?.name && aspect.value) {
      specs.push({ key: aspect.name, value: aspect.value });
    }
  }
  if (item.brand) specs.push({ key: "Brand", value: item.brand });
  if (item.condition) specs.push({ key: "Condition", value: item.condition });
  return uniqSpecs(specs);
}

function extractReviewBreakdown(reviewRating) {
  const breakdown = { five: 0, four: 0, three: 0, two: 0, one: 0 };
  for (const row of reviewRating?.ratingHistograms || []) {
    const rating = Number(row.rating);
    const count = Number(row.count || 0);
    if (rating === 5) breakdown.five = count;
    if (rating === 4) breakdown.four = count;
    if (rating === 3) breakdown.three = count;
    if (rating === 2) breakdown.two = count;
    if (rating === 1) breakdown.one = count;
  }
  return breakdown;
}

async function getCategoryId(categoryName) {
  const category = (await Category.findOne({ name: categoryName })) || null;
  return category?._id || null;
}

async function baseProductFromEbay(item, categoryName) {
  if (!item || !categoryName) return {};
  const title = item.title || "Untitled Product";
  const description = item.description || "";
  const shortDescription = item.shortDescription || "";
  const specs = mapSpecifications(item); //localizedAspects

  return {
    itemId: item.itemId,
    title,
    slug: `${slugify(title)}-${String(item.itemId || "")
      .replace(/\|/g, "-")
      .toLowerCase()}`,
    shortDescription,
    description,
    specifications: specs.map((s) => ({
      name: s.key,
      value: s.value,
    })),
    seo: {
      metaTitle: truncate(title, 70),
      metaDescription: truncate(shortDescription, 160),
    },
    price: Number(item?.price?.value || 0),
    currency: item?.price?.currency || "USD",
    originalPrice: null,
    brand: item?.brand || "",
    category: await getCategoryId(categoryName),
    sourceCategoryName: categoryName,
    mainImage: {
      url: item?.image?.imageUrl || "",
      alt: `image of ${categoryName}`,
    },
    images:
      item?.additionalImages?.map((i) => ({
        url: i.imageUrl,
        alt: `image of ${categoryName}`,
      })) || [],
    shipping: {
      estimatedDeliveryMinDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedDeliveryMaxDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      shipsFrom: "Alexandria, Egypt",
      costs: [
        {
          shipsTo: "Alexandria, Egypt",
          cost: Number(item?.shippingOptions?.[0]?.shippingCost?.value || 10),
        },
        {
          shipsTo: "Cairo, Egypt",
          cost: Number(item?.shippingOptions?.[1]?.shippingCost?.value || 30),
        },
        {
          shipsTo: "Giza, Egypt",
          cost: Number(item?.shippingOptions?.[2]?.shippingCost?.value || 30),
        },
        {
          shipsTo: "Behira, Egypt",
          cost: Number(item?.shippingOptions?.[3]?.shippingCost?.value || 20),
        },
        {
          shipsTo: "Matrouh, Egypt",
          cost: Number(item?.shippingOptions?.[4]?.shippingCost?.value || 40),
        },
      ]
    },
    returnPolicy: {
      isReturnAccepted: item?.returnTerms?.returnsAccepted ?? false,
      returnWindowDays: Number(item?.returnTerms?.returnPeriod?.value || 0),
      returnFeesPaidBy:
        item?.returnTerms?.returnShippingCostPayer === "SELLER"
          ? "SELLER"
          : item?.returnTerms?.returnShippingCostPayer === "BUYER"
            ? "BUYER"
            : "NONE",
      notes: item?.returnTerms?.refundMethod || "",
    },
    isActive: true,

    hasVariants: true,

    variants: [
      {
        sku: String(item.itemId || ""),
        attributes: {
          color: {
            name: "Color",
            hex: "",
          },
          size: "",
          storage: "",
          ram: "",
          ssd: "",
        },
        price: Number(item?.price?.value || 0),
        compareAtPrice: null,
        stock: Number(
          item?.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity || 0,
        ),
        lowStockThreshold: 5,
        availabilityStatus:
          item?.estimatedAvailabilities?.[0]?.estimatedAvailabilityStatus ||
          "IN_STOCK",
        images: item?.additionalImages || [],
        isActive: true,
      },
    ],

    reviewSummary: {
      averageRating: Number(item?.reviewRating?.averageRating || 0),
      reviewsCount: Number(item?.reviewRating?.reviewCount || 0),
      ratingBreakdown: extractReviewBreakdown(item?.reviewRating),
      lastSyncedAt: new Date(),
    },
    reviews: [],
    tags: [],
    soldCount: 0,
    viewsCount: 0,
    status: "PARTIAL",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { baseProductFromEbay };
