// routes/userRoutes.js

const express = require('express');
const multer = require('multer');
const userController = require('../controllers/usercontroller.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST endpoint for uploading audio
router.post('/upload-audio/:userId/:textPromptId', upload.single('audio'), userController.uploadAudio);

// You can add more user-related routes here...

module.exports = router;
