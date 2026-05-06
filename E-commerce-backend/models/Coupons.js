const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },

    type: {
      type: String,
      default: "PERCENTAGE",
      enum: ["PERCENTAGE", "FIXED", "FREE_SHIPPING"],
    },

    value: {
      type: Number,
      default: 0,
    },

    expireDate: {
      type: Date,
      required: true,
    },

    usages: {
      type: Number,
      default: 0,
    },

    usageLimit: {
      type: Number,
      default: 0,
    },

    minOrder: {
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
