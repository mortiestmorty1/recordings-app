const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    count:
    {
        type:Number,
    },
    consent:{
        type:Boolean,
    },
    recordings:{
        type:Audio,
    },
})

module.exports = mongoose.model('User', userSchema);