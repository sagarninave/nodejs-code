const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const user = require('../schema/user.schema');
const forgetpassword = require('../schema/forgetpassword.schema');

const mydbs = [
  { databasename: "user", database: user },
  { databasename: "forgetpassword", database: forgetpassword }
]

const mongoDBURL = `${process.env.DB_TYPE}+${process.env.DB_SCHEME}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_DIRECTORY}.${process.env.DB_PROVIDER}.${process.env.DB_DOMAIN}/${process.env.DB_NAME}`;

mongoose.connect(mongoDBURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open on ' + mongoDBURL);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

let backuppath = './dbbackup';
let datapath = backuppath + '/data';

function dbFolder() {
  if (!fs.existsSync(backuppath)) {
    fs.mkdirSync(backuppath);
  }
}

function dataFolder() {
  if (!fs.existsSync(datapath)) {
    fs.mkdirSync(datapath);
  }
}

function fileFolder(dbfile) {
  let filepath = datapath + "/" + dbfile;
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  return filepath;
}

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