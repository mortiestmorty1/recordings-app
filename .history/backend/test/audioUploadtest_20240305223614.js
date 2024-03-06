// Importing modules using ES Module syntax
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import path from 'path';
import server from '../index.js'; // Make sure the relative path is correct

const should = chai.should();

chai.use(chaiHttp);

describe('Audio Upload', () => {
  const userId = '1'; // Ensure you replace these with actual or mock values suitable for testing
  const textPromptId = '1';

  it('should upload an audio file', (done) => {
    chai.request(server)
        .post(`/user/upload-audio/${userId}/${textPromptId}`)
        .attach('audio', path.join(path.resolve(), 'test', 'audio1.mp3'), 'audio1.mp3')
        .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            // Further assertions based on your application's response
            done();
        });
  });
});
