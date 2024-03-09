const Recording = require('../models/recordings');
const Text = require('../models/text');
const User = require('../models/user');
const admin = require('firebase-admin');
const serviceAccount = require('./recorder-33d22-firebase-adminsdk-nwmxg-b60aea5d95.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://recorder-33d22.appspot.com'
  });

const bucket = admin.storage().bucket();

const recordingsfirebase = {
    uploadRecording: async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { userId, textId } = req.body; // Assuming these are passed in the request body or as URL parameters

        try {
            // Construct the file name
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const userName = user.name; 
            const cleanUserName = userName.replace(/\s+/g, '_');
            const fileName = `recordings/${cleanUserName}/${req.file.originalname}`;
            const file = bucket.file(fileName);

            // Upload the file to Firebase Storage
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
            });

            // Make the file publicly accessible (if needed)
            await file.makePublic();

            // Construct the public URL
            const voiceNoteUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

            // Create a new Recording document
            console.log('userId:', userId);
            const recording = new Recording({
                userId : userId,
                textId : textId,
                voiceNoteUrl : voiceNoteUrl
            });
            
            await recording.save();
            // Optionally, update the Text document to include this recording
            // Note: This step depends on your application's specific data relationships
            console.log("textId:", textId);
            await Text.findByIdAndUpdate(
                textId, 
                {
                    $push: { recordings: recording._id },
                    $inc: { Count: 1 } // Atomically increment the count
                },
                { new: true }
            );
            await User.findByIdAndUpdate(
                userId, 
                {
                    $push: { recordings: recording._id },
                },
                { new: true }
            );
                console.log('Recording uploaded successfully');
            res.status(201).json({ message: 'Recording uploaded successfully', voiceNoteUrl });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).send('Error uploading the recording.');
        }
    },

    // Add more controller methods as needed...
};

module.exports = {
    uploadRecording: recordingsfirebase.uploadRecording
};
