const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Importing the user and forgetpassword schemas. */
const user = require('../schema/user.schema');
const forgetpassword = require('../schema/forgetpassword.schema');

/* An array of objects. Each object has two properties: databasename and database. The databasename
property is the name of the database and the database property is the schema of the database. */
const mydbs = [
  { databasename: "user", database: user },
  { databasename: "forgetpassword", database: forgetpassword }
]

/* Creating a URL to connect to the MongoDB database. */
const mongoDBURL = `${process.env.DB_TYPE}+${process.env.DB_SCHEME}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_DIRECTORY}.${process.env.DB_PROVIDER}.${process.env.DB_DOMAIN}/${process.env.DB_NAME}`;

/* Connecting to the MongoDB database. */
mongoose.connect(mongoDBURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10
});

/* This is a callback function that is called when the connection to the MongoDB database is successful. */
mongoose.connection.on('connected', function () {
  console.log(`MongoDB connected to ${process.env.DB_NAME} database`);
});

/* This is a callback function that is called when there is an error in the connection to the MongoDB database. */
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

/* This is a callback function that is called when the connection to the MongoDB database is disconnected. */
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

let backuppath = './dbbackup';
let datapath = backuppath + '/data';

/**
 * If the backup folder doesn't exist, create it
 */
function dbFolder() {
  if (!fs.existsSync(backuppath)) {
    fs.mkdirSync(backuppath);
  }
}

/**
 * If the data folder doesn't exist, create it
 */
/**
 * If the data folder doesn't exist, create it
 */
function dataFolder() {
  if (!fs.existsSync(datapath)) {
    fs.mkdirSync(datapath);
  }
}

/**
 * If the folder doesn't exist, create it
 * @param dbfile - The name of the database file.
 * @returns The filepath is being returned.
 */
function fileFolder(dbfile) {
  let filepath = datapath + "/" + dbfile;
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  return filepath;
}

/* This is a callback function that is called when the user makes a GET request to the /dbbackup route. */
const dbbackup = router.get('/', (req, res, next) => {
  dbFolder();
  dataFolder();
  mydbs.map(db => {
    db.database.find().then(result => {
      let data = JSON.stringify(result, null, 2);
      let date = new Date();
      let filename = db.databasename + "-" +
        date.getDate() + "-" +
        date.getMonth() + 1 + "-" +
        date.getFullYear() + "-" +
        date.getHours() + "-" +
        date.getMinutes() + "-" +
        date.getSeconds() + ".json";
      let filelocation = fileFolder(db.databasename) + `/${filename}`;
      fs.writeFile(filelocation, data, function (err) {
        if (err) {
          throw err;
        }
        else {
          res.status(200).json({
            status: "success",
            message: "backup taken successfully"
          });
        }
      });
    });
  })
});

module.exports = {
  mongoose,
  dbbackup
};