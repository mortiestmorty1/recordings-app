const recordingscontroller = require('../controllers/recordingscontroller');
const express = require('express');
const router = express.Router();

router.post('/createRecordings', recordingscontroller.recordingsfirebase);

module.exports = router;

