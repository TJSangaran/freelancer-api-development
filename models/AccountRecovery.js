const mongoose = require("mongoose");

const accountRecoverySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        email: {
            type: String
        },
        OTP: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['initiated', 'terminated', 'completed', 'expired'],
            default: 'initiated'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("accountRecovery", accountRecoverySchema);
