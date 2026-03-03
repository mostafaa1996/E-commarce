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
  billingDetails: 
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
      AddressId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      isDefault: Boolean,
    },
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

  Addresses : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    default: [],
  }],

  reviews: [
    {
      rate: { type: Number, default: 0 },
      comment: { type: String, default: "" },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],



  resetPasswordToken: String,
  resetPasswordExpires: Date,

  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
});

module.exports = mongoose.model("User", UserSchema);
