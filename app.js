const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dbConfig = require('./config/localdb');
// const dbConfig = require('./config/serverdb');

const userRoute = require('./routes/user.route');

mongoose.connect(dbConfig.mongoDBURL, dbConfig.mongoDBParams);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./constants/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.options('*', cors());
app.use(cors())

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/api/user', userRoute);

app.use((req, res, next) => {
  const error = new Error('Invalid endpoint');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  let errorResponse = {
    status: 'failed',
    message: error.message
  };
  res.status(error.status || 500).json({error:errorResponse});
});

module.exports = app;