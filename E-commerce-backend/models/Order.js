const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    Notes: { type: String },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "failed",
        "cancelled",
        "orderPlaced",
        "delivered",
        "shipped",
        "returned",
      ],
      default: "pending_payment",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded", "not_required"],
      default: "pending",
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    selectedCardId: { type: String, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    paidAt: Date,
    paymentFailureReason: {
      code: String,
      message: String,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", OrderSchema);
