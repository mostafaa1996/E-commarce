const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        avatar: String
    },
    rating: Number,
    comment: String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    createdAt: Date
});

module.exports = mongoose.model("Review", ReviewSchema);