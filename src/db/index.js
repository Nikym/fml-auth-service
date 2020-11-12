const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

module.exports = {
  query: (text, params) => pool.query(text, params),
  getUserByUsername: async (username) => (await pool.query('SELECT * FROM users WHERE username = $1', [username])).rows[0],
  createUser: (id, username, hash) => pool.query(
    'INSERT INTO users(id, username, passwordHash) VALUES ($1, $2, $3)',
    [id, username, hash],
  ),
};