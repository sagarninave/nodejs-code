const mongoose = require('mongoose');
const { message, regex, statusCode } = require('../../constants');
const { mailOptions, sendEmail } = require('../../email/emailConfig');
const emailTemplate = require('../../email/emailTemplate');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const User = require('../../schema/user.schema');

/* This is a function that is used to check if a user exists or not. */
exports.checkuserexists = (req, res) => {

  User.findOne({ email: req.params.email })
    .select('_id email')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: message.SUCCESS,
          message: message.USER_EXISTS,
          data: result
        }
        return res.status(statusCode.OK).json(response);
      }
      else {
        let response = {
          status: message.FAILED,
          message: message.USER_NOT_EXISTS
        }
        return res.status(statusCode.OK).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: message.WRONG
      };
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse);
    });
  console.log("🚀 ~ file: auth.controller.js:38 ~ req.params.email:", req.params.email)
};

/* This is a function that is used to register a user. */
exports.signup = (req, res) => {

  let userId = new mongoose.Types.ObjectId();

  if (!regex.EMAIL.test(req.body.email)) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      status: message.FAILED,
      message: message.INVALID_EMAIL
    });
  }
  else if (!regex.PASSWORD.test(req.body.password)) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      status: message.FAILED,
      message: message.INVALID_PASSWORD
    });
  }

  User.find({ email: req.body.email })
    .exec()
    .then(result => {
      if (result.length >= 1) {
        let response = {
          status: message.FAILED,
          message: message.USER_EXISTS
        }
        return res.status(statusCode.OK).json(response);
      }
      else {
        const user = new User({
          _id: userId,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: passwordHash.generate(req.body.password),
          phone_code: req.body.phone_code,
          phone: req.body.phone,
        });

        user.save()
          .then(result => {
            if (result) {
              let link = `http://localhost:8000/api/user/verifyemail/${userId}`
              mailOptions.subject = "Email Verification"
              mailOptions.to = req.body.email;
              mailOptions.html = emailTemplate.emailVerificationTemplate(link)
              sendEmail(mailOptions);

              let response = {
                status: message.SUCCESS,
                message: message.USER_REGISTERATION,
              };
              res.status(statusCode.CREATED).json(response);
            }
          })
          .catch(error => {
            let errorResponse = {
              error: message.WRONG
            };
            res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse);
          });
      }
    })
};

/* This is a function that is used to verify a user's email. */
exports.verifyemail = (req, res) => {

  let userId = req.params.userId;

  User.findByIdAndUpdate(userId, { $set: { verified: true } })
    .then(result => {
      if (result) {
        let response = {
          status: message.SUCCESS,
          message: message.EMAIL_VERIFIED
        }
        res.status(statusCode.OK).json(response);
      }
      else {
        let response = {
          status: message.FAILED,
          message: message.USER_NOT_EXISTS + ' and ' + message.EMAIL_VERIFICATION_FAILED
        }
        return res.status(statusCode.OK).json(response);
      }
    }).catch(error => {
      let errorResponse = {
        status: status.error,
        message: message.WRONG
      };
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse);
    });
};

/* This is a function that is used to login a user. */
exports.login = (req, res) => {

  let userEmail = req.body.email;
  let userPassword = req.body.password;

  User.findOne({ email: userEmail })
    .exec()
    .then(result => {
      if (result) {

        let isAuthenticated = passwordHash.verify(userPassword, result.password);

        if (isAuthenticated) {
          let user = {
            id: result._id,
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            role: result.role,
          };

          let accessToken = jwt.sign(user, process.env.ACCESS_KEY, { expiresIn: process.env.ACCESS_KEY_EXPIRE_IN });
          let refreshToken = jwt.sign(user, process.env.REFRESH_KEY, { expiresIn: process.env.REFRESH_KEY });

          let response = {
            status: message.SUCCESS,
            message: message.LOGIN,
            user: {
              id: result._id,
              first_name: result.first_name,
              last_name: result.last_name,
              email: result.email,
              role: result.role,
              access_token: accessToken,
              refresh_token: refreshToken
            }
          };

          User.findByIdAndUpdate(result._id, {
            $set: {
              last_login: Date.now()
            }
          })
            .then(result => {
              let email = user.email;
              let emailData = {
                ip: '120.21.334.332',
                system: "Sagar'sPC",
                time: new Date(),
                location: "New Delhi, India",
              }
              mailOptions.subject = "Recent Login"
              mailOptions.to = email;
              mailOptions.html = emailTemplate.recentLoginTemplate(emailData)
              sendEmail(mailOptions);
              return res.status(statusCode.OK).json(response);

            }).catch(error => {
              let errorResponse = {
                error: message.WRONG
              };
              res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse);
            });
        }
        else {
          let response = {
            status: message.FAILED,
            message: message.WRONG_PASSWORD
          }
          return res.status(statusCode.OK).json(response);
        }
      }
      else {
        let response = {
          status: message.FAILED,
          message: message.USER_NOT_EXISTS
        }
        return res.status(statusCode.OK).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: message.WRONG
      };
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse);
    });
};

/* This is a function that is used to send a recent login email. */
exports.recentloginemailsend = (req, res) => {
  let email = "sagarninave@gmail.com";
  let emailData = {
    time: new Date(),
    ip: '120.21.334.332',
    location: "New Delhi, India",
    system: "Sagar'sPC"
  }
  mailOptions.subject = "Recent Login"
  mailOptions.to = email;
  mailOptions.html = emailTemplate.recentLoginTemplate(emailData)
  sendEmail(mailOptions);

  let response = {
    status: message.SUCCESS,
    message: message.LOGIN_EMAIL_SEND
  }
  return res.status(statusCode.OK).json(response);
}