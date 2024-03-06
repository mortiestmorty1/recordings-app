// controllers/userController.js

const User = require('../models/user');
const firebaseAdmin = require('../firebase'); // Make sure this path is correct
const userController = {
    uploadAudio: async (req, res) => {
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }
  
      const { userId, textPromptId } = req.params;
      const { buffer, mimetype, originalname } = req.file;
  
      try {
        // Ensure userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).send('Invalid userId');
        }
  
        const firebaseUrl = await firebaseAdmin.uploadAudioToFirebase(buffer, mimetype, originalname);
        
        // Assuming userId is an ObjectId and needs to be used as such
        const user = await User.findByIdAndUpdate(mongoose.Types.ObjectId(userId), {
          $push: { recordings: { textPrompt: textPromptId, firebaseUrl: firebaseUrl }},
        }, { new: true });
  
        res.status(200).json({ message: 'Recording uploaded successfully', firebaseUrl });
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Error uploading the recording');
      }
    },
  };

module.exports = userController;
