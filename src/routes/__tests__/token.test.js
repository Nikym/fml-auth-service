const request = require('supertest');
const app = require('../../app');
require('dotenv').config();

jest.mock('../../db');

describe('auth/token', () => {
  it('returns 200 if access token succcessfuly refreshed', async () => {
    const response = await request(app)
      .get('/auth/token')
      .set('Cookie', ['refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMzQiLCJ1c2VybmFtZSI6ImV4aXN0cyJ9.ioj2N0kWwS3lB9vr_magnS4fYZL3DPBTerFAPq6RblI; Path=/; HttpOnly']);

    expect(response.statusCode).toBe(200);
    expect(Object.keys(response.body)).toContain('token');
  });

  it('returns 401 if no refresh token present', async () => {
    const response = await request(app)
      .get('/auth/token');

    expect(response.statusCode).toBe(401);
  });

  it('returns 401 if refresh token is invalid, and removes cookie', async () => {
    const response = await request(app)
      .get('/auth/token')
      .set('Cookie', ['refreshToken=1234; httpOnly']);

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
  });

  it('returns 401 if refresh token does not match stored, and remove refresh token cookie', async () => {
    const response = await request(app)
      .get('/auth/token')
      .set('Cookie', ['refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMzQiLCJ1c2VybmFtZSI6ImV4aXN0In0.J9aTTx_9KCI9evovXmNN2p4YsUVDo1ahRdCKStcnf54; Path=/; HttpOnly']);

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
  });
});
