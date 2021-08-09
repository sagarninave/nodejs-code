const mongoose = require('mongoose');
var fs = require('fs');
var express = require('express');
const router = express.Router();

const user = require('../schema/user.schema');
const forgetpassword = require('../schema/forgetpassword.schema');
const mydbs=[
  {databasename:"user", database:user},
  {databasename:"forgetpassword", database:forgetpassword}
]
// mongoDBURL = "mongodb://127.0.0.1:27017/gajavakra";
mongoDBURL = "mongodb+srv://gajavakraadminusername:1YV92lm3fZXqR7Zb@cluster0.ylnkg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
let datapath = backuppath+'/data';

function dbfolder(){
  if (!fs.existsSync(backuppath)){
    fs.mkdirSync(backuppath);
  }
}

function datafolder(){
  if (!fs.existsSync(datapath)){
    fs.mkdirSync(datapath);
  }
}

function filefolder(dbfile){
  let filepath = datapath+"/"+dbfile;
  if (!fs.existsSync(filepath)){
    fs.mkdirSync(filepath);
  }
  return filepath;
}

const dbbackup = router.get('/', (req, res, next) => {
  dbfolder();
  datafolder();
  mydbs.map(db => {
    db.database.find().then(result => {
      let data = JSON.stringify(result, null, 2);
      let date = new Date();
      let filename = db.databasename+"-"+
                     date.getDate()+"-"+
                     date.getMonth()+1+"-"+
                     date.getFullYear()+"-"+
                     date.getHours()+"-"+
                     date.getMinutes()+"-"+
                     date.getSeconds()+".json";
      let filelocation = filefolder(db.databasename)+`/${filename}`;
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