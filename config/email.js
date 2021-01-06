const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dipakhedaoo2020@gmail.com',
    pass: 'Dipak@0712'
  }
});

const mailOptions = {
  from: 'Dipak Hedaoo <dipakhedaoo2020@gmail.com>',
  to: '',
  subject: 'Email Verification',
  html: ''
};

const emailTemplate = (link) => {
  html = `<html>
            <body>
              <div style="border: 1px solid black; width: max-content";">
                <center> 
                  <img src="https://gajavakraganesh.web.app/assets/images/shortcutIcon.png" style="width:100px; height:auto;margin-top: 2%;"/>
                </center>
                <div style="margin: 8px;">
                  <p>Welcome to Ganaraj!</p>
                  <p>An account for Ganaraj was created for this email address.  If this is correct, you can verify your email by clicking below link <br/> 
                    <a href="${link}"> Verify Email </a>
                  </p>
                  <p>If you did not sign up for this account, you can let us know by contacting <br/>sagarninave@gmail.com.</p>
                  <p style="font-weight:bolder">GANARAJ</p>
                </div>
              </div>        
            </body>
          </html>`;
  return html
}

const sendEmail = (mailConfig) => {
  transporter.sendMail(mailConfig, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}

module.exports = {
  transporter,
  mailOptions,
  emailTemplate,
  sendEmail
};
