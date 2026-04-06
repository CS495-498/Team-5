/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This file tests the login and verification APIs with cookie-based auth. */

const { chai, mocha, expect, app, testUser } = require('../common');

mocha.describe('login API', () => {
    mocha.it('sets an HttpOnly session cookie for a successful login attempt', async () => {
        const res = await chai.request(app)
            .post('/api/login')
            .send({ username: testUser.username, password: testUser.password });

        expect(res).to.have.status(200);
        expect(res).to.be.json;

        // Token should NOT be in the response body anymore
        expect(res.body).to.not.have.property('token');

        // Cookie should be set
        expect(res).to.have.header('set-cookie');
        expect(res.header['set-cookie'][0]).to.include('HttpOnly');
    });

    mocha.it('returns 401 for a wrong password', async () => {
        const res = await chai.request(app)
            .post('/api/login')
            .send({ username: testUser.username, password: testUser.password + 'wrong' });

        expect(res).to.have.status(401);
        expect(res.body).to.not.have.property('token');
    });

    mocha.it('returns 401 for a wrong user', async () => {
        const res = await chai.request(app)
            .post('/api/login')
            .send({ username: testUser.username + 'nope', password: testUser.password });

        expect(res).to.have.status(401);
        expect(res.body).to.not.have.property('token');
    });
});

mocha.describe('verification API', () => {
    mocha.it('returns 200 when authenticated via session cookie', async () => {
        const agent = chai.request.agent(app);

        // Log in first to establish session cookie
        const loginRes = await agent.post('/api/login')
            .send({ username: testUser.username, password: testUser.password });

        expect(loginRes).to.have.status(200);

        // Verification request should succeed USING COOKIE (no token sent)
        const verifyRes = await agent.post('/api/verification');

        expect(verifyRes).to.have.status(200);
    });
});