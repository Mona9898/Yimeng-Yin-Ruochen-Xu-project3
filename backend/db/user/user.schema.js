const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // created time
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});

module.exports = userSchema;
