const mongoose = require('mongoose');

mongoDBURL = "mongodb://127.0.0.1:27017/ganaraj";
// mongoDBURL = "mongodb+srv://adminuser:adminpassword@cluster0.wzs7f.mongodb.net/Cluster0?retryWrites=true&w=majority";

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

module.exports = { mongoose };