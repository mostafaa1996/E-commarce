const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
  billingDetails: [
    {
      firstName: String,
      lastName: String,
      email: String,
      companyName: String,
      country: String,
      state: String,
      city: String,
      street: String,
      building: String,
      Apartment: String,
      postalCode: String,
      phone: String,
      notes: String,
      isDefault: Boolean,
    },
  ],
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  wishlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
    default: [],
  },
  notifications: [
    {
      message: String,
      date: Date,
      seen: Boolean,
    },
  ],
  paymentMethods: [
    {
      cardBrand: String,
      last4: String,
      expiryMonth: Number,
      expiryYear: Number,
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
});

module.exports = mongoose.model("User", UserSchema);
