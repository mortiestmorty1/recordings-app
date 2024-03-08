const express = require('express');
const multer = require('multer');
const { uploadRecording } = require('../controllers/recordingscontroller');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createRecordings', upload.single('audio'), uploadRecording);

module.exports = router;

