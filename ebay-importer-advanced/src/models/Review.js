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

  rating: { type: Number, required: true, min: 1, max: 5 },

  comment: String,

  isApproved: { type: Boolean, default: true }

}, { timestamps: true });


// 🔥 Indexes
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;