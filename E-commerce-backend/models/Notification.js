const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    type: {
      type: String,
      required: true,
      enum: [
        "NEW_ORDER",
        "PAYMENT_FAILED",
        "PAYMENT_REFUNDED",

        "LOW_STOCK",
        "CRITICAL_STOCK",
        "OUT_OF_STOCK",

        "NEW_REVIEW",
        "NEGATIVE_REVIEW",
        "REVIEW_REQUIRES_APPROVAL",

        "NEW_CONTACT_MESSAGE",
        "RETURN_REQUEST",
        "CANCELLATION_REQUEST",

        "NEW_CUSTOMER_SIGNUP",
      ],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    entityType: {
      type: String,
      enum: ["ORDER", "PRODUCT", "REVIEW", "USER", "CONTACT_MESSAGE"],
      default: null,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    link: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", NotificationSchema);
