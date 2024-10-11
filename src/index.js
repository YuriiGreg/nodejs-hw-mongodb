require('dotenv').config();
console.log('MongoDB User:', process.env.MONGODB_USER);
console.log('MongoDB URL:', process.env.MONGODB_URL);

const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

(async () => {
  await initMongoConnection();
  setupServer();
})();
