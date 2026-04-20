const mongoose = require("mongoose");

const VATSchema = new mongoose.Schema({
    vat: {
        type: Number,
        required: true,
    },
    delivery: [
        {
          place: {
            type: String,
            required: true,
          },
          cost: {
            type: Number,
            required: true,
          },
        }
    ],
});

module.exports = mongoose.model("VAT_delivery", VATSchema);