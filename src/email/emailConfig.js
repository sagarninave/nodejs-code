const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dipakhedaoo2020@gmail.com',
    pass: 'Dipak@0712'
  }
});

const mailOptions = {
  from: 'Ganaraj <dipakhedaoo2020@gmail.com>',
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
