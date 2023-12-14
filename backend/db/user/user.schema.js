const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
});

module.exports = UserSchema;
