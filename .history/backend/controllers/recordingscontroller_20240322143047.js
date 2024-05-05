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

        const { userId, textId, textString } = req.body;


        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const userName = user.name; 
            const cleanUserName = userName.replace(/\s+/g, '_');
            const fileName = `recordings/${cleanUserName}/${req.file.originalname}`;
            const file = bucket.file(fileName);

            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
            });


            await file.makePublic();

       
            const voiceNoteUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

            console.log('userId:', userId);
            const recording = new Recording({
                userId : userId,
                textId : textId,
                textString : textString,
                voiceNoteUrl : voiceNoteUrl
            });
            
            await recording.save();
            console.log("textId:", textId);
            await Text.findByIdAndUpdate(
                textId, 
                {
                    $push: { recordings: recording._id },
                    $inc: { Count: 1 }
                },
                { new: true }
            );
            await User.findByIdAndUpdate(
                userId, 
                {
                    $push: { recordings: recording._id },
                    $inc: { count: 1 }
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

};

module.exports = {
    uploadRecording: recordingsfirebase.uploadRecording
};
