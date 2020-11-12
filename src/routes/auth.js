const Router = require('express-promise-router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const router = Router();

const db = require('../db');

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

  const user = await db.getUserByUsername(username);

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

/**
 * POST /auth/register business logic
 *
 * Handles registering new users using details in given request body.
 * If successful returns 200 OK, otherwise 400 Bad Request with an error message.
 */
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
  const user = await db.getUserByUsername(username);
  if (user) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = uuid();

  await db.createUser(userId, username, hash);

  res.status(200);
});

module.exports = router;
