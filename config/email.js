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
  subject: '',
  html: ''
};

const emailVerificationTemplate = (link) => {
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

const forgetPasswordTemplate = (link) => {
  html = `<html>
            <body>
              <div style="border: 1px solid black; width: max-content";">
                <center> 
                  <img src="https://gajavakraganesh.web.app/assets/images/shortcutIcon.png" style="width:100px; height:auto;margin-top: 2%;"/>
                </center>
                <div style="margin: 8px;">
                  <p>Welcome to Ganaraj!</p>
                  <p>Set new password for this account.
                    <a href="${link}"> Forget Password </a>
                  </p>
                  <p>If you did not request to set new password for this account, you can let us know by contacting <br/>sagarninave@gmail.com.</p>
                  <p style="font-weight:bolder">GANARAJ</p>
                </div>
              </div>        
            </body>
          </html>`;
  return html
}

const recentLoginTemplate = (emailData) => {
  html = `<html>
            <body>
              <div style="border: 1px solid black; width: max-content";">
                <center> 
                  <img src="https://gajavakraganesh.web.app/assets/images/shortcutIcon.png" style="width:100px; height:auto;margin-top: 2%;"/>
                </center>
                <div style="margin: 8px;">
                  <p>Welcome to Ganaraj!</p>
                  <p> You have recently logged in <br>
                  IP: ${emailData.ip} <br/>
                  System: ${emailData.system} <br/>
                  Time: ${emailData.time} <br/>
                  Location: ${emailData.location} <br/>
                  </p>
                  <p>
                    If you did not logged in, you can let us know by contacting <br/>sagarninave@gmail.com. 
                    <br/>
                    <b> OR </b>
                    <br/>

                    <a href="#">Reset Password </a>
                  </p>
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
  emailVerificationTemplate,
  forgetPasswordTemplate,
  recentLoginTemplate,
  sendEmail
};
