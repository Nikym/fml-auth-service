const request = require('supertest');
const app = require('../../app');
require('dotenv').config();

jest.mock('../../db');

describe('auth/register', () => {
  const getResponse = (body) => request(app)
    .post('/auth/register')
    .send(body)
    .set('Content-Type', 'application/json');

  it('returns 400 if missing required fields', async () => {
    const response = await getResponse({});

    expect(response.statusCode).toBe(400);

    const response2 = await getResponse({
      username: 'test',
    });

    expect(response2.statusCode).toBe(400);
  });

  it('returns 400 if user already exists', async () => {
    const response = await getResponse({
      username: 'exists',
      password: 'password',
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 if username is less than 3 characters', async () => {
    const response = await getResponse({
      username: 'te',
      password: 'password',
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 if username contains whitespace', async () => {
    const response = await getResponse({
      username: 't est',
      password: 'password',
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 if password is less than 8 characters long', async () => {
    const response = await getResponse({
      username: 'test',
      password: 'pass',
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 200 if registration is successful', async () => {
    const response = await getResponse({
      username: 'test',
      password: 'password',
    });

    expect(response.statusCode).toBe(200);
  });
});
