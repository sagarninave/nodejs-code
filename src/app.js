const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE
})

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.options('*', cors());
app.use(cors())

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const { dbbackup } = require('./config/mongoDB');
const userRoute = require('./routes/user.route');

app.get('/', (req, res) => {
  res.sendFile( __dirname+"/static/welcome.html")
})

app.use('/dbbackup', dbbackup);
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
  res.status(error.status || 500).json({ error: errorResponse });
});

module.exports = app;