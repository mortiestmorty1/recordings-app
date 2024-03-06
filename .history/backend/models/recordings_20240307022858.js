const mongoose = require('mongoose');

const recordingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    textId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Text',
        required: true,
    },
    voiceNoteUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Recording', recordingSchema);

