const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    workingHours: {type:String, required:true},
    workingDays: {type:String, required:true},
    holiday: {type:String, required:true},
    shippingFee: [
      {
        place: {
          type: String,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
    icon: { type: String },
  },
  { timestamps: true },
);

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
