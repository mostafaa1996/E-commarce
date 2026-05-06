const mongoose = require("mongoose");

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
      enum: ["ACTIVE", "EXPIRED", "USED"],
    },
  },
  { timestamps: true },
);

discountSchema.index({ productId: 1 });

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;