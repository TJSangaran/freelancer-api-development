const mongoose = require("mongoose");
const Image = require("./schemas/Image")

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "Please add First name"],
        },
        lastname: {
            type: String,
            required: [true, "Please add Last name"],
        },
        email: {
            type: String,
            required: [true, "Please add an Email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please add Password"],
        },
        phone: {
            type: String,
            required: [true, "Please add Phone"],
        },
        description: {
            type: String,
        },
        tags: [
            {
                type: String,
            },
        ],
        address: {
            street: {
                type: String,
                default: null,
            },
            town: {
                type: String,
                default: null,
            },
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
        dob: {
            type: Date,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        isErrand: {
            type: Boolean,
            required: true,
        },
        readyToWork: {
            type: Boolean,
            required: true,
        },
        banned: {
            type: Boolean,
            default: false,
        },
        avgRating: {
            type: Number,
            required: true,
            default: 0,
        },
        noOfRatings: {
            type: Number,
            default: 0
        },
        bankname: {
            type: String,
        },
        accountname: {
            type: String,
        },
        accountnumber: {
            type: Number,
        },
        profileColor: {
            type: Number,
            min: 1,
            max: 10
        },
        images: Image
    },
    { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
