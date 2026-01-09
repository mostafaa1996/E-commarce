const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      name: String,
      avatar: String
    },
    rating: Number,
    comment: String,
    createdAt: Date
  },
  { _id: false }
);

const VariantSchema = new mongoose.Schema(
  {
    color: String,
    size: String,
    storage: String,
    price: Number,
    stock: Number,
    sku: String
  },
  { _id: false }
);

const ImageSchema = new mongoose.Schema(
  {
    url: String,
    color: String
  },
  { _id: false }
);

const AdditionalInfoSchema = new mongoose.Schema(
  {
    key: String,
    value: String
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    /* ===== Core ===== */
    title: { type: String, required: true },
    shortDescription: String,
    description: String,

    /* ===== Pricing ===== */
    price: { type: Number, required: true },
    originalPrice: Number,
    currency: { type: String, default: "EGP" },

    /* ===== Identification ===== */
    sku: String,
    brand: String,
    category: String,
    tags: [String],

    /* ===== Media ===== */
    images: [ImageSchema],

    /* ===== Variants ===== */
    variants: [VariantSchema],

    /* ===== Inventory ===== */
    stock: Number,
    isActive: { type: Boolean, default: true },

    /* ===== Specifications ===== */
    additionalInfo: [AdditionalInfoSchema],

    /* ===== Reviews ===== */
    reviews: [ReviewSchema],
    reviewsCount: { type: Number, default: 0 },
    rating: Number,

    /* ===== Scraping / Enrichment ===== */
    productUrl: String,
    status: {
      type: String,
      enum: ["PARTIAL", "COMPLETE"],
      default: "PARTIAL"
    },

    /* ===== Source Tracking ===== */
    source: {
      provider: String,
      externalId: String
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("Product", ProductSchema);
