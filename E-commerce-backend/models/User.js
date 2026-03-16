const mongoose = require("mongoose");
const { default: Stripe } = require("stripe");
const Cart = require("./Cart");

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
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
  PersonalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    DateOfBirth: Date,
    gender: String,
    location: String,
    Bio: String,
    avatar: {
      url: String,
      publicId : String,
    },
    createdAt : {
      type: Date,
      default: Date.now,
    },
    updatedAt : {
      type: Date,
      default: Date.now,
    },
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    default: null,
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

  Addresses : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    default: [],
  }],

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: [],
    },
  ],

  stripeCustomerId: { type: String , default: null },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
});

module.exports = mongoose.model("User", UserSchema);
