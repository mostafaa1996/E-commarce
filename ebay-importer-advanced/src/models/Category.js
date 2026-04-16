const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true, index: true },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },

  // useful for fast queries
  ancestors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    }
  ],

  icon: {
    icon: String,
    alt: String
  },

  keywords: String,

  attachedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  isActive: { type: Boolean, default: true },

}, { timestamps: true });


// 🔥 Indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ ancestors: 1 });

 const Category = mongoose.model("Category", categorySchema);

module.exports = Category;