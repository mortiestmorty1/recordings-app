const express = require('express');
const multer = require('multer');
const { uploadRecording } = require('../controllers/recordingscontroller');

const router = express.Router();

// Set up storage engine
const storage = multer.memoryStorage();

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

// Configure your route to use multer middleware for file uploads
router.post('/createRecordings', upload.single('audio'), uploadRecording);

module.exports = router;

