const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'XXXXXXXXXX',
    pass: 'XXXXXXXXXX'
  }
});

const mailOptions = {
  from: 'Ganaraj <XXXXXXXXXX>',
  to: '',
  subject: '',
  html: ''
};

const sendEmail = (mailConfig) => {
  transporter.sendMail(mailConfig, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  mailOptions,
  sendEmail
};
