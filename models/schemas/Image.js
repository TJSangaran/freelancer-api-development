const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: {
        type: String
    },
    fileId: {
        type: String
    }
});

module.exports = ImageSchema