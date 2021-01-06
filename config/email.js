const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sagarninave@gmail.com',
    pass: 'Sagar@0712'
  }
});

const mailOptions = {
  from: 'Sagar Ninave <sagarninave@gmail.com>',
  to: '',
  subject: 'Email Verification',
  html: ''
};

module.exports = {
  transporter,
  mailOptions
};
