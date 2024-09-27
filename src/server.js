const express = require('express');
const app = express();
const contactsRoutes = require('./routers/contacts'); 
const errorHandler = require('./middlewares/errorHandler'); 
const notFoundHandler = require('./middlewares/notFoundHandler'); 


app.use(express.json());

app.use('/contacts', contactsRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

const setupServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = setupServer;







