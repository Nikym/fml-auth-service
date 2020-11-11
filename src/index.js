const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const authRouter = require('./authRouter/authRouter');

app.use('/auth', authRouter);

app.listen({
  port: process.env.PORT || 8000,
}, () => {
  console.clear();
  console.log('Started Authentication Service...');
});
