const mongoose = require('mongoose');
const recordingsSchema = require('./recordings');

const textSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    }
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