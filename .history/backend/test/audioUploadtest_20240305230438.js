// test/audioUploadTest.js
// Dynamically import chai and chaiHttp as a workaround
let chai, chaiHttp;
(async () => {
  if (!chai) {
    chai = (await import('chai')).default;
    chaiHttp = (await import('chai-http')).default;
    chai.use(chaiHttp);
  }
})();
const fs = require('fs');
const path = require('path');
const server = require('../index'); // Adjust the path as needed to import your server

const should = chai.should();

chai.use(chaiHttp);

describe('Audio Upload', () => {
  // Replace USER_ID and TEXTPROMPT_ID with actual values you expect
  const userId = '1';
  const textPromptId = '1';

  it('should upload an audio file', (done) => {
    chai.request(server)
        .post(`/user/upload-audio/${userId}/${textPromptId}`)
        .attach('audio', path.join(__dirname, 'audio1.mp3'), 'audio1.mp3')
        .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            // Further assertions based on your application's response
            // For example, you might want to check if the response body
            // contains a URL for the uploaded file
            done();
        });
  });
});
