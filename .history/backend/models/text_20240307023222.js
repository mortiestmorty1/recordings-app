const mongoose = require('mongoose');
const recordingsSchema = require('./recordings');
const { type } = require('os');

const textSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    Count:{
        type: Number,
    },
    recordings :{
        type:Array,
        [recordingsSchema]
    }
})

module.exports = mongoose.model('Text', textSchema);