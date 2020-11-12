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
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  getUserByUsername: async (username) => (await pool.query('SELECT * FROM users WHERE username = $1', [username])).rows[0],
  createUser: (id, username, hash) => pool.query(
    'INSERT INTO users(id, username, passwordHash) VALUES ($1, $2, $3)',
    [id, username, hash],
  ),
};
