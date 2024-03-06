const express = require('express');
const router = express.Router();
const { uploadRecording } = require('../controllers/recordingscontroller');

router.post('/createRecordings', uploadRecording);

module.exports = router;

