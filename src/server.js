const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const pinoHttp = require('pino-http')({ logger: pino });
const contactRoutes = require('./routes/contactRoutes');
const createError = require('http-errors');

function setupServer() {
  const app = express();


  app.use(cors());
  app.use(pinoHttp); 
  app.use(express.json()); 

  
  app.use('/api/v1/contacts', contactRoutes); 


  app.use((req, res, next) => {
    next(createError(404, 'Not found'));
  });


  app.use((err, req, res, next) => {
    const statusCode = err.status || 500; 
    res.status(statusCode).json({
      status: statusCode,
      message: err.message || 'Internal Server Error',
    });
  });


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    pino.info(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;




