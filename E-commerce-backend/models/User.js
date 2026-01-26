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
    addresses: [
        {
          fullName: String,
          country: String,
          city: String,
          street: String,
          building: String,
          postalCode: String,
          phone: String,
          isDefault: Boolean
        }
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
        subtotal: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
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
          seen: Boolean
        }
      ],
    paymentMethods: [
        {
          cardBrand: String, 
          last4: String, 
          expiryMonth: Number,
          expiryYear: Number
        }
      ],

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
});

module.exports = mongoose.model("User", UserSchema);