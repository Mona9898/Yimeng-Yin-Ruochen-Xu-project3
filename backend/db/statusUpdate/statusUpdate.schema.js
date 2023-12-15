const mongoose = require('mongoose');

const StatusUpdateSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // other fields
});

module.exports = StatusUpdateSchema;
