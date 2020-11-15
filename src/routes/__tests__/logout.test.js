const request = require('supertest');
const app = require('../../app');

jest.mock('../../db');

describe('auth/logout', () => {
  const getResponse = () => request(app)
    .get('/auth/logout');

  it('returns 400 if user is not logged in', async () => {
    const response = await getResponse();

    expect(response.statusCode).toBe(400);
  });

  it('returns 200 if refresh token doesn\'t match stored token', async () => {
    const response = await request(app)
      .get('/auth/logout')
      .set('Cookie', ['refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMzQiLCJ1c2VybmFtZSI6ImV4aXN0In0.J9aTTx_9KCI9evovXmNN2p4YsUVDo1ahRdCKStcnf54; Path=/; HttpOnly']);

    expect(response.statusCode).toBe(200);
  });

  it('returns 200 if user is logged out', async () => {
    const response = await request(app)
      .get('/auth/logout')
      .set('Cookie', ['refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMzQiLCJ1c2VybmFtZSI6ImV4aXN0cyJ9.ioj2N0kWwS3lB9vr_magnS4fYZL3DPBTerFAPq6RblI; Path=/; HttpOnly']);

    expect(response.statusCode).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
  });
});
