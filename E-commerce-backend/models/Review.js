 const mongoose = require("mongoose");  
 const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  username: String,

  rating: { type: Number, required: true, min: 1, max: 5 },

  comment: String,

  isApproved: { type: Boolean, default: true },

  verified: { type: Boolean, default: false },

  date: { type: Date, default: new Date(Date.now()) },

}, { timestamps: true });


//Indexes
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;