// Import necessary modules
import path from 'path';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
// Dynamic import of your server in the test file
let server;
before(async function () {
    server = (await import('../index.js')).default;
});

// Use chai-http middleware
chai.use(chaiHttp);

describe('Audio Upload', function () {
    const userId = '1'; // Ensure these are valid for your test
    const textPromptId = '1';

    it('should upload an audio file', function (done) {
        // Make sure server is properly imported at the top
        chai.request(server)
            .post(`/user/upload-audio/${userId}/${textPromptId}`)
            .attach('audio', path.join(path.resolve(), 'test', 'audio1.mp3'), 'audio1.mp3')
            .end((err, res) => {
                expect(res).to.have.status(200);
                // Further assertions based on your application's response
                done();
            });
    });
});
