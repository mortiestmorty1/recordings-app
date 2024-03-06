// test/audioUploadTest.js

const chai = require('chai');
const chaiHttp = require('chai-http');
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
        .attach('audio', fs.readFileSync(path.join(__dirname, 'testAudio.mp3')), 'testAudio.mp3')
        .end((err, res) => {
            res.should.have.status(200);
            // Further assertions based on your application's response
            done();
        });
  });
});
