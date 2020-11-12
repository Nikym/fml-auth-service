const Router = require('express-promise-router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const router = Router();

const db = require('../db');

const mockdb = {};

// Mock Cassandra db
const models = {
  instance: {
    User: {
      findOneAsync: (options) => {
        if (options.username === 'test') {
          return {
            user_id: 1,
            username: 'test',
            passwordHash: '$2b$10$v5NKX/W63IsLjOOwVJ9bPOf9O8SLp3ioEm/OUo1c8yExlzW6tCDou',
          };
        }
        return null;
      },
    },
  },
};

/**
 * POST /auth/login business logic
 *
 * Handles login validation for given request body.
 * Sets JWT refresh token cookie and returns access token if authenticated.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Missing required fields in body' });
    return;
  }

  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = rows[0];

  if (user) {
    const { passwordHash } = user;

    // Compare password to the stored hash password, if matches then create token
    if (await bcrypt.compare(password, passwordHash)) {
      const accessToken = jwt.sign(
        {
          id: user.user_id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '30m',
        },
      );

      res.status(200).json({
        token: accessToken,
      });
      return;
    }
  }

  res.status(401).json({ error: 'Username or password incorrect' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Fields username and password required' });
    return;
  }

  if (username.length < 3 || username.includes(' ')) {
    res.status(400).json({ error: 'Username is invalid' });
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be 8 characters or above' });
  }

  // Check if username already exists in DB
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  if (rows.length > 0) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = uuid();

  await db.query(
    'INSERT INTO users(id, username, passwordHash) VALUES ($1, $2, $3)',
    [userId, username, hash],
  );

  res.status(200);
});

module.exports = router;
