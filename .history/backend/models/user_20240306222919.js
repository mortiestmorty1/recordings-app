const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for automatic generation
        required: true,
        auto: true // Automatically generate the ObjectId
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    count:{
        type: Number,
        default: 0
    },
    consent: {
        type: Boolean,
        required: true
    },
})
module.exports = mongoose.model('User', userSchema);

