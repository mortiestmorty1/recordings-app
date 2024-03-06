import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import server from '../index.js'; // Adjust the path as necessary
 // Adjust the path as needed to import your server

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
