const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    voiceNoteUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recording', recordingSchema);
    