 const mongoose = require("mongoose");  
 const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  username: String,

  date: Date,

  verified: {
    type: Boolean,
    default: false,
  },

  rating: { type: Number, required: true, min: 1, max: 5 },

  comment: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

}, { timestamps: true });


// 🔥 Indexes
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
