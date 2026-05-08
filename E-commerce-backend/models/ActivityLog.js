const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "PRODUCT_CREATED",
        "PRODUCT_UPDATED",
        "PRODUCT_DELETED",
        "ORDER_STATUS_CHANGED",
        "COUPON_CREATED",
        "COUPON_UPDATED",
        "COUPON_DELETED",
        "DISCOUNT_CREATED", 
        "DISCOUNT_UPDATED",
        "DISCOUNT_DELETED",
        "CUSTOMER_BLOCKED",
        "CUSTOMER_UNBLOCKED",
        "ADMIN_LOGIN",
        "ADMIN_LOGOUT",
        "REVIEW_UPDATED",
        "REVIEW_DELETED",
        "Category_CREATED",
        "Category_UPDATED",
        "Category_DELETED"
      ],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    actorRole: {
      type: String,
      enum: ["admin", "user", "system"],
      default: "system"
    },

    createdAt: {
      type: Date,
      default: new Date(Date.now())
    },

    ipAddress: String,

  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);