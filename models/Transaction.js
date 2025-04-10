const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ["deposit", "withdrawal"],
            required: [true]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
