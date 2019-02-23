const app = require('./app');
const { SERVER_PORT } = require('./config');

app.listen(SERVER_PORT, function() {
  console.log(`Server starting on port ${SERVER_PORT}!`);
});
