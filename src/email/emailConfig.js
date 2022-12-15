const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: `Boilerplate ${process.env.EMAIL_USERNAME}`,
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
