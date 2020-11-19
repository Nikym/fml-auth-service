const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

/**
 * Simplified calls to Postgres by abstracting away from direct
 * querying.
 *
 * getUserByUsername returns a single JSON object describing given
 * username, if exist.
 *
 * createUser adds user to a database.
 *
 * storeRefreshToken stores a refresh token thats associated with a user.
 *
 * getRefreshToken retrieves a given user's refresh token, if any.
 *
 * deleteRefreshToken removes refresh token associated with a particular user.
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  getUserByUsername: async (username) => (await pool.query('SELECT * FROM journeys.users WHERE username = $1', [username])).rows[0],
  createUser: (id, username, hash) => pool.query(
    'INSERT INTO journeys.users(id, username, passwordHash) VALUES ($1, $2, $3)',
    [id, username, hash],
  ),
  storeRefreshToken: (id, token) => pool.query(
    'INSERT INTO journeys.tokens(id, token) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET token = $2',
    [id, token],
  ),
  getRefreshToken: async (id) => (await pool.query(
    'SELECT * FROM journeys.tokens WHERE id = $1',
    [id],
  )).rows[0],
  deleteRefreshToken: (id) => pool.query(
    'DELETE FROM journeys.tokens WHERE id = $1',
    [id],
  ),
};
