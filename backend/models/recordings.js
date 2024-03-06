const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    id : {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    textId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Text'
    },
    voiceNoteUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recording', recordingSchema);
    