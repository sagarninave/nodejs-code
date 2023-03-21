const nodemailer = require('nodemailer');

/* Creating a transporter object that will be used to send emails. */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

/* This is the default mail options that will be used to send emails. */
const mailOptions = {
  from: `Boilerplate ${process.env.EMAIL_USERNAME}`,
  to: '',
  subject: '',
  html: ''
};

/**
 * It takes a mailConfig object as an argument, and then uses the nodemailer transporter to send the
 * email
 * @param mailConfig - This is the object that contains the email configuration.
 */
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
