const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    shippingFee: { type: Number },
    icon: { type: String },
  },
  { timestamps: true },
);

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
