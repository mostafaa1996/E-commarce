const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      default: "PERCENTAGE",
      enum: ["PERCENTAGE", "FIXED", "FREE_SHIPPING"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      default: 0,
    },

    eligibilityType: {
      type: String,
      enum: [
        "MIN_ORDER_VALUE",
        "MIN_ORDERS_COUNT",
        "MIN_TOTAL_SPENT",
        "FIRST_ORDER",
        "SPECIFIC_USERS",
      ],
      required: true,
    },

    eligibilityValue: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "EGP"],
    },

    expireDate: {
      type: Date,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    usageLimit: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "EXPIRED", "USED"],
    },
  },
  { timestamps: true },
);

const discountSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    title: { type: String, required: true },

    sku: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "PERCENTAGE",
      enum: ["PERCENTAGE", "FIXED"],
    },

    value: {
      type: Number,
      default: 0,
    },

    expireDate: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    compareAtPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "EXPIRED", "USED"],
    },
  },
  { timestamps: true },
);

couponsSchema.index({ code: 1 });
discountSchema.index({ productId: 1 });

const Coupon = mongoose.model("Coupon", couponsSchema);
const Discount = mongoose.model("Discount", discountSchema);

module.exports = {
  Coupon,
  Discount,
};
