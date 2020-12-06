// Node Modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

module.exports.initializeServer = () => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use('/', require('./api'));

  app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started at port: ${process.env.SERVER_PORT}`);
  });
};
