const express = require('express');
const multer = require('multer');
const { uploadRecording } = require('../controllers/recordingscontroller');

const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Make sure this uploads directory exists
    },
    filename: function(req, file, cb) {
        // You can include a timestamp in the filename to ensure uniqueness
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

// Configure your route to use multer middleware for file uploads
router.post('/createRecordings', upload.single('audio'), uploadRecording);

module.exports = router;
