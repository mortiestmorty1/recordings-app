const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    },
    recordings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recording'
      }]
});

module.exports = mongoose.model('User', userSchema);
