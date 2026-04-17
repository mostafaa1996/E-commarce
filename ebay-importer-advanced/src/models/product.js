const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },

    attributes: {
      color: {
        name: String,
        hex: String,
      },
      size: String,
      storage: String,
      ram: String,
      ssd: String,
    },

    price: { type: Number, required: true },
    compareAtPrice: Number, // old price

    stock: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 5 },
    availabilityStatus: { type: String, default: "IN_STOCK" },

    images: [
      {
        url: String,
        alt: String,
        colorHint: String,
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    description: String,
    shortDescription: String,

    brand: { type: String },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    sourceCategoryName: String,
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },

    specifications: [
      {
        name: String,
        value: String,
      },
    ],

    mainImage: {
      url: String,
      alt: String,
    },

    images: [
      {
        url: String,
        alt: String,
      },
    ],

    // SEO
    seo: {
      metaTitle: String,
      metaDescription: String,
    },

    shipping: {
      estimatedDeliveryMinDate: { type: Date, default: new Date(Date.now()) },
      estimatedDeliveryMaxDate: { type: Date, default: new Date(Date.now()) },
      shipsFrom: { type: String, default: "" },
      costs: [
        {
          shipsTo: { type: String, default: "" },
          cost: { type: Number, default: 0 },
        },
      ],
    },

    returnPolicy: {
      isReturnAccepted: { type: Boolean, default: false },
      returnWindowDays: { type: Number, default: 0 },
      returnFeesPaidBy: { type: String, default: "BUYER" },
      notes: { type: String, default: "" },
    },

    isActive: { type: Boolean, default: true },

    status: { type: String, default: "PARTIAL" },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: { type: Date, default: new Date(Date.now()) },

    variants: [variantSchema],
    hasVariants: { type: Boolean, default: false },

    // Precomputed fields (important for performance)
    pricing: {
      minPrice: Number,
      maxPrice: Number,
    },

    inventory: {
      totalStock: Number,
    },

    soldCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },

    defaultVariantId: String,

    tags: [String],

    reviewSummary: {
      averageRating: { type: Number, default: 0 },
      reviewsCount: { type: Number, default: 0 },
      lastSyncedAt: { type: Date, default: new Date(Date.now()) },
      ratingBreakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 },
      },
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true },
);

// 🔥 Indexes (critical)
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ "variants.sku": 1 });
productSchema.index({ "pricing.minPrice": 1, "pricing.maxPrice": 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
