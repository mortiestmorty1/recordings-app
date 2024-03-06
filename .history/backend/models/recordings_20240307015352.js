const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
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
const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;