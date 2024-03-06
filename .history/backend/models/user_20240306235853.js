const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
