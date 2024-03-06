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
    count:{
        type: Number,
    },
    recordings:{
        
    }

})
module.exports = mongoose.model('User', userSchema);

