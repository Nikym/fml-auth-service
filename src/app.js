const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRouter = require('./routes/auth');

app.use(cors({
  // exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  credentials: true,
  origin: [
    'http://localhost:8080',
  ],
}));
app.use('/auth', authRouter);

module.exports = app;
