const mongoose = require('mongoose');
const recordingsSchema = require('./recordings');

const textSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    Count:{
        type: Number,
    },
    recordings :[recordingsSchema]
})

module.exports = mongoose.model('Text', textSchema);