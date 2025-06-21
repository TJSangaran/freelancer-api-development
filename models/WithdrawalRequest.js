const mongoose = require("mongoose");

const withdrawalRequestSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["initiated", "accecpted", "denied"],
            required: [true],
            default: "initiated"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("withdrawalRequest", withdrawalRequestSchema);
