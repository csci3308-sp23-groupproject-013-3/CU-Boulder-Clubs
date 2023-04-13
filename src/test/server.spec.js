// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe('Server!', () => {
    // Sample test case given to test / endpoint.
    it('Returns the default welcome message', done => {
        chai
            .request(server)
            .get('/welcome')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals('success');
                assert.strictEqual(res.body.message, 'Welcome!');
                done();
            });
    });

    // ===========================================================================
    // TO-DO: Part A Login unit test case
    it('positive: post register', done => {
        chai
            .request(server)
            .post('/register')
            .send({ username: 'admin', password: 'admin' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.strictEqual(res.body.message, 'Registration successful');
                done();
            });
    });

    it('negative: post register', done => {
        chai
            .request(server)
            .post('/register')
            .send({ username: 'admin', password: 'admin' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.strictEqual(res.body.message, 'Username already exists');
                done();
            });
    });

    it('positive: post login', done => {
        chai
            .request(server)
            .post('/login')
            .send({ username: 'admin', password: 'admin' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.strictEqual(res.body.message, 'Welcome!');
                done();
            });
    });

    it('negative: post login', done => {
        chai
            .request(server)
            .post('/login')
            .send({ username: 'admin', password: 'admin1' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.strictEqual(res.body.message, 'Incorrect username or password');
                done();
            });
    });
});