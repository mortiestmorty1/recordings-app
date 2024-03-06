const mongoose = require('mongoose');

const Schema = mongoose.Schema({
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
    },
    recordings:{
        type: Array,
    }

})
module.exports = mongoose.model('User', userSchema);

