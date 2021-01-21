const mongoose = require('mongoose');
var fs = require('fs');
var express = require('express');
const router = express.Router();

const user = require('../schema/user.schema');
const forgetpassword = require('../schema/forgetpassword.schema');

mongoDBURL = "mongodb://127.0.0.1:27017/ganaraj";
// mongoDBURL = "mongodb+srv://adminuser:adminpassword@cluster0.wzs7f.mongodb.net/Cluster0?retryWrites=true&w=majority";

mongoose.connect(mongoDBURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10
});

const dbbackup = router.get('/', (req, res, next) => {
  // user table backup
  user.find().then(result => {
    let data = JSON.stringify(result, null, 2);
    fs.writeFile('./backup/user.json', data, function (err) {
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

  // forgrtpassword table backup
  forgetpassword.find().then(result => {
    let data = JSON.stringify(result, null, 2);
    fs.writeFile('./backup/forgetpassword.json', data, function (err) {
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

module.exports = {
  mongoose,
  dbbackup
};