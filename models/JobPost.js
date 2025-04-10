const mongoose = require("mongoose");

const jobPostSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add title"],
        },
        body: {
            type: String,
            required: [true, "Please add body"],
        },
        priceFrom: {
            type: Number,
            required: true
        },
        priceTo: {
            type: Number,
            required: true
        },
        days: {
            type: Number,
            required: true
        },
        jobPosterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        public: {
            type: Boolean,
            required: true,
            default: true
        },
        tags: [{
            type: String,
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("jobpost", jobPostSchema);
