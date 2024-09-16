const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const pinoHttp = require('pino-http')({ logger: pino });
const contactRoutes = require('./routes/contactRoutes');

function setupServer() {
  const app = express();

  
  app.use(cors());
  app.use(pinoHttp);
  app.use(express.json()); 


  app.use('/', contactRoutes); 

  
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;


