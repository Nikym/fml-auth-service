const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
require('dotenv').config();

describe('auth/login', () => {
  const getResponse = async (body) => request(app)
    .post('/auth/login')
    .send(body)
    .set('Content-Type', 'application/json');

  it('returns 400 if missing fields', async () => {
    const response1 = await getResponse({});

    expect(response1.statusCode).toBe(400);

    const response2 = await getResponse({ username: 'test' });

    expect(response2.statusCode).toBe(400);
  });

  it('returns 401 if password is incorrect', async () => {
    const response = await getResponse({
      username: 'test',
      password: 'incorrect',
    });

    expect(response.statusCode).toBe(401);
  });

  it('returns 401 if username is incorrect / doesn\'t exist', async () => {
    const response = await getResponse({
      username: 'incorrect',
      password: 'password',
    });

    expect(response.statusCode).toBe(401);
  });

  it('returns 200 if login credentials are correct', async () => {
    const response = await getResponse({
      username: 'test',
      password: 'password',
    });

    expect(response.statusCode).toBe(200);
  });

  it('returns JWT token if login credential are correct', async () => {
    const response = await getResponse({
      username: 'test',
      password: 'password',
    });

    const payload = jwt.verify(response.body.token, process.env.JWT_SECRET);

    expect(response.statusCode).toBe(200);
    expect(payload.id).toBe(1);
    expect(payload.username).toBe('test');
  });

  it('sets refreshToken cookie if login credentials are correct', async () => {
    const response = await getResponse({
      username: 'test',
      password: 'password',
    });

    expect(true).toBe(false);
  });
});
