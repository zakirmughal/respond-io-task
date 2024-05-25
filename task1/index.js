const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");

const Config = require('./config');

// function to initialize chat server over express
const messengerBotServer = () => {

  // initialize express object
  const app = express();
  app.set('port', Config.server.port);

  // setup and start the HTTP server
  const server = http.createServer(app);

  server.on('listening', () => {
    const {port, address} = server.address();
    console.info({port}, 'Server listening');
  });

  server.on('error', (error) => {
    console.error({err: error}, 'HTTP server error');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection at:', reason.stack || reason);
  });

  app.use(express.json({
    type: ['application/json', 'text/plain']
  }));

  // use helmet for security and setting various HTTP headers
  app.use(helmet());

  // use CORS to handle allow cross origin issue.
  const corsOptions = {
    origin: '*',
    methods: ["GET", "POST"]
  }
  app.use(cors(corsOptions));

  // user API routes and send IO to API
  const api = require('./app/api')();
  app.use('/api', api);

  // Workers can share any TCP connection
  // In this case it is an HTTP server
  server.listen(Config.server.port);
};

// calling chat server function
messengerBotServer();
