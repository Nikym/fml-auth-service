const Router = require('express-promise-router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = Router();

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

  // TODO: Change login to function with an actual database
  const user = await models.instance.User.findOneAsync({ username });

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

  // TODO: Check if user already exists

  const hash = await bcrypt.hash(password, 10);

  mockdb[username] = hash;

  res.send('success');
});

module.exports = router;
