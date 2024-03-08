const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    },
    consent: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
