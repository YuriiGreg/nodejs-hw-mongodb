require('dotenv').config();
const setupServer = () => {
  const express = require('express');
const app = express();
  const authRouter = require('./routers/auth');
  const contactsRoutes = require('./routers/contacts'); 
  const errorHandler = require('./middlewares/errorHandler'); 
  const notFoundHandler = require('./middlewares/notFoundHandler'); 

  const cookieParser = require('cookie-parser'); 
  
  app.use(cookieParser()); 

  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRoutes);
  
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = setupServer;









