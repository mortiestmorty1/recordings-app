const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    textId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Text', 
        required: true,
    },
    voiceNoteUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recording', recordingSchema);
