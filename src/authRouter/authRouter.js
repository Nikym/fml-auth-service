const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  res.send('login');
});

router.post('/register', (req, res) => {
  res.send('register');
});

module.exports = router;
