// controllers/userController.js

const User = require('../models/user');
const firebaseAdmin = require('../firebase'); // Make sure this path is correct

const uploadAudio = {
  uploadAudio: async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { userId, textPromptId } = req.params;
    const { buffer, mimetype, originalname } = req.file;

    try {
      const firebaseUrl = await firebaseAdmin.uploadAudioToFirebase(buffer, mimetype, originalname);
      
      const user = await User.findByIdAndUpdate(userId, {
        $push: { recordings: { textPrompt: textPromptId, firebaseUrl: firebaseUrl }},
      }, { new: true });

      res.status(200).json({ message: 'Recording uploaded successfully', firebaseUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).send('Error uploading the recording');
    }
  },

  // Add other user-related controller methods here...
};

module.exports ={
   uploadAudio 
}
