const mongoose = require("mongoose");
const VAT = require("./VAT");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
      subtotal: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  itemsPrice: {
    type: Number,
    default: 0,
  },
  promo: {
    code : {
      type: String,
      default: null
    },
    appliedAt: {
      type: Date,
      default: null
    },
    discountInMoney: {
      type: Number,
      default: 0
    }
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  TAX: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "USD",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
