const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-firebase-adminsdk.json'); // Replace with the correct path to your downloaded JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://recorder-33d22.appspot.com' // Replace with your actual bucket name
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
      // The URL to access the file directly via Firebase Storage is in the format:
      // `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`
    });

    stream.end(fileBuffer);

    // The URL for accessing the file, this may need to be retrieved differently depending on your Firebase Storage rules
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

    return publicUrl;
  },
  
  // Add more Firebase-related functions as needed
};
