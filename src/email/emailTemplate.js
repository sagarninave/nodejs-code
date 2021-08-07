const recentLoginTemplate = (emailData) => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" 
              rel="stylesheet" crossorigin="anonymous"
              integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1">
        <style>
          .row {
            border: 1px solid #ff851b;
            max-width: 300px;
          }
          .resetPassword {
            text-align: center;
            background-color: #ff851b;
            color: #fff;
            padding: 7px 10px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 18px;
            border:none;
            margin-left: 24%;
          }
          .resetPasswordLink{
            text-decoration:none; 
            color:#fff; 
            font-size:15px;
          }
          .info{
            padding:0; 
            margin:0; 
            margin-bottom:5px
          }
          img{
            width:80px; 
            height:auto;
            margin-top: 2%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12">
              <center>
                <img src="https://gajavakraganesh.web.app/assets/images/shortcutIcon.png"/>
              </center>
              <div style="margin: 8px; text-align: left;">
                <p>Welcome to gajavakra!</p>
                <p> You have recently logged in  </p>
                <p class="info"> IP: ${emailData.ip} </p>
                <p class="info"> System: ${emailData.system} </p>
                <p class="info"> Time: ${emailData.time} </p>
                <p class="info"> Location: ${emailData.location} </p>
                <p style="text-align:center"> If you did not logged in then</p>
                <button class="resetPassword"> 
                  <a href="#" class="resetPasswordLink" style="color:#fff;">
                    Reset Password 
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;
}

const emailVerificationTemplate = (link) => {
  return `<!doctype html>
          <html lang="en">
            <head>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" 
                    rel="stylesheet" crossorigin="anonymous"
                    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1">
              <style>
                .row {
                  border: 1px solid #ff851b;
                  max-width: 300px;
                }
                .resetPassword {
                  text-align: center;
                  background-color: #ff851b;
                  color: #fff;
                  padding: 7px 10px;
                  text-decoration: none;
                  font-weight: bold;
                  border-radius: 18px;
                  border:none;
                  margin-left: 24%;
                  margin-bottom: 10px;
                }
                .resetPasswordLink{
                  text-decoration:none; 
                  color:#fff; 
                  font-size:15px;
                }
                img{
                  width:80px; 
                  height:auto;
                  margin-top: 2%;
                }
                .head{
                  text-align: center;
                  font-weight: bold;
                }
                span{
                  text-decoration: underline;
                  color: blue;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-md-12">
                    <center>
                      <img src="https://gajavakraganesh.web.app/assets/images/shortcutIcon.png"/>
                    </center>
                    <div style="margin: 8px; text-align: left;">
                      <p class="head">Welcome to gajavakra!</p>
                      <p>
                        An account created for gajavakra using this email address.
                      </p>
                      <p>
                        If this is correct, you can verify your email by clicking below link.
                      </p>
                      <button class="resetPassword"> 
                        <a href="${link}" class="resetPasswordLink" style="color:#fff;">
                          Verify Account 
                        </a>
                      </button>
                      <p>
                        If you did not sign up for this account, you can let us know by contacting <br/>
                        <span> sagarninave@gmail.com </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>`;
}

const forgetPasswordTemplate = (link) => {
  return `<!doctype html>
          <html lang="en">
            <head>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" 
                    rel="stylesheet" crossorigin="anonymous"
                    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1">
              <style>
                .row {
                  border: 1px solid #ff851b;
                  max-width: 300px;
                }
                .resetPassword {
                  text-align: center;
                  background-color: #ff851b;
                  color: #fff;
                  padding: 7px 10px;
                  text-decoration: none;
                  font-weight: bold;
                  border-radius: 18px;
                  border:none;
                  margin-left: 24%;
                  margin-bottom: 10px;
                }
                .resetPasswordLink{
                  text-decoration:none; 
                  color:#fff; 
                  font-size:15px;
                }
                img{
                  width:80px; 
                  height:auto;
                  margin-top: 2%;
                }
                .head{
                    text-align: center;
                    font-weight: bold;
                }
                span{
                    text-decoration: underline;
                    color: blue;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-md-12">
                    <center>
                      <img src="https://gajavakraganesh.web.app/assets/images/shortcutIcon.png"/>
                    </center>
                    <div style="margin: 8px; text-align: left;">
                          <p class="head">Welcome to gajavakra!</p>
                          <p style="text-align:center">Set new password for this account.</p>
                          <button class="resetPassword"> 
                              <a href="${link}" class="resetPasswordLink" style="color:#fff;">
                                  Reset Password 
                              </a>
                          </button>
                          <p style="margin-bottom:10px; text-align:center">
                              If you did not requested then contact, <br/>
                              <span> sagarninave@gmail.com </span>
                          </p>
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>`;
}

module.exports = { 
  recentLoginTemplate, 
  emailVerificationTemplate,
  forgetPasswordTemplate 
};
  