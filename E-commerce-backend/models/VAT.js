const mongoose = require("mongoose");

const VATSchema = new mongoose.Schema({
    VAT: {
        type: Number,
        required: true,
    },
    shipping: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("VAT_shipping", VATSchema);