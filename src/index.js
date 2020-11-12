const app = require('./app');

app.listen({
  port: process.env.PORT || 8000,
}, () => {
  console.clear();
  console.log('Started Authentication Service...');
});
