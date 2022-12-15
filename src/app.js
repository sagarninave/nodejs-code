const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

/* This is to configure the cloudinary API. */
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE
})

/* A middleware that logs all the requests to the console. */
app.use(morgan('dev'));

/* Parsing the body of the request. */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* This is to allow cross origin requests. */
app.options('*', cors());
app.use(cors())

/* This is to serve static files. */
app.use('/static', express.static(path.join(__dirname, 'static')))

/* This is to allow cross origin requests. */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

/* This is to enable swagger documentation for the API. */
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* This is importing the routes. */
const { dbbackup } = require('./config/mongoDB');
const userRoute = require('./routes/user.route');

app.get('/', (req, res) => {
  res.sendFile( __dirname+"/static/welcome.html")
})

app.use('/dbbackup', dbbackup);
app.use('/api/user', userRoute);

/* This is to handle invalid endpoints. */
app.use((req, res, next) => {
  const error = new Error('Invalid endpoint');
  error.status = 404;
  next(error);
})

/* This is to handle errors. */
app.use((error, req, res, next) => {
  let errorResponse = {
    status: 'failed',
    message: error.message
  };
  res.status(error.status || 500).json({ error: errorResponse });
});

module.exports = app;