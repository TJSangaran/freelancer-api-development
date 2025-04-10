const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add title"],
        },
        body: {
            type: String,
            required: [true, "Please add body"],
        },
        price: {
            type: Number,
            required: true
        },
        days: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["initiated", "cancelled", "accecpted", "denied", "completeRequested", "completed"],
            required: true,
            default: "initiated"
        },
        errandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        errandReview: {
            rating: {
                type: Number
            },
            reviewMessage: {
                type: String
            }
        },
        jobPosterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        jobPosterReview: {
            rating: {
                type: Number
            },
            reviewMessage: {
                type: String
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("job", jobSchema);
