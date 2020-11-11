const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.listen({
  port: process.env.PORT,
}, () => {
  console.clear();
  console.log('Started Authentication Service...');
});
