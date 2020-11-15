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
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '30m',
        },
      );

      const refreshToken = jwt.sign(
        {
          created: new Date(),
          id: user.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        },
      );

      await db.storeRefreshToken(user.id, refreshToken);

      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 3600000 * 24 * 7),
        httpOnly: true,
      });

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
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be 8 characters or above' });
    return;
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

  res.sendStatus(200);
});

/**
 * GET /auth/logout business logic
 *
 * Handles logging user out of the website.
 * When request sent, deletes refreshToken cookie if it is present.
 */
router.get('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(400).json({ error: 'Already logged out' });
    return;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    res.cookie('refreshToken', '', {
      expires: new Date(Date.now() - 3600000 * 24),
      httpOnly: true,
    });
    res.status(401).json({ error: 'Refresh token invalid' });
    return;
  }

  const { id } = payload;

  await db.deleteRefreshToken(id);

  res.cookie('refreshToken', '', {
    expires: new Date(Date.now() - 3600000 * 24),
    httpOnly: true,
  });

  res.sendStatus(200);
});

router.get('/token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({ error: 'User not logged in' });
    return;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    res.cookie('refreshToken', '', {
      expires: new Date(Date.now() - 3600000 * 24),
      httpOnly: true,
    });
    res.status(401).json({ error: 'Refresh token invalid' });
    return;
  }

  const { id, username } = payload;
  const storedToken = await db.getRefreshToken(id);

  if (storedToken !== refreshToken) {
    res.cookie('refreshToken', '', {
      expires: new Date(Date.now() - 3600000 * 24),
      httpOnly: true,
    });
    res.status(401).json({ error: 'Refresh token doesn\'t match stored token, has been removed' });
    return;
  }

  const accessToken = jwt.sign(
    {
      id,
      username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30m',
    },
  );

  res.status(200).json({ token: accessToken });
});

module.exports = router;
