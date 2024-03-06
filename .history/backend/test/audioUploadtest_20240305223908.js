// Dynamically import chai and chaiHttp
async function setup() {
    const { default: chai } = await import('chai');
    const chaiHttp = await import('chai-http');
    chai.use(chaiHttp.default);

    return { chai, chaiHttp };
}

describe('Audio Upload', function () {
    let chai, chaiHttp;
    before(async function () {
        ({ chai, chaiHttp } = await setup());
    });

    const userId = '1'; // Ensure these are valid for your test
    const textPromptId = '1';

    it('should upload an audio file', function (done) {
        // Make sure server is properly imported at the top
        chai.request(server)
            .post(`/user/upload-audio/${userId}/${textPromptId}`)
            .attach('audio', path.join(path.resolve(), 'test', 'audio1.mp3'), 'audio1.mp3')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                // Further assertions based on your application's response
                done();
            });
    });
});
