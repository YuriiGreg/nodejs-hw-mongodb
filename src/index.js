require('dotenv').config();
console.log('MongoDB User:', process.env.MONGODB_USER);
console.log('MongoDB URL:', process.env.MONGODB_URL);

const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

(async () => {
  await initMongoConnection();
  setupServer();
})();
