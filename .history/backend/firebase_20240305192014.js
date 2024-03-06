const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-firebase-adminsdk.json'); // Download this from your Firebase project settings

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-firebase-storage-bucket-url'
});

const bucket = admin.storage().bucket();

module.exports = {
  // Function to upload file to Firebase Cloud Storage
  uploadAudioToFirebase: async (fileBuffer, mimeType, fileName) => {
    const file = bucket.file('recordings/' + fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType,
      },
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
    });

    stream.on('finish', async () => {
      // Make the file publicly readable (if necessary)
      await file.makePublic();
    });

    stream.end(fileBuffer);

    return file.publicUrl(); // Return the public URL for the file
  },
  
  // Add more Firebase-related functions as needed
};
