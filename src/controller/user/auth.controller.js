const mongoose = require('mongoose');
const { successMessage, errorMessage, httpStatus } = require('../../constants/httpresponse');
const { invalidConstants, userConstants } = require('../../constants/message');
const { credentials } = require('../../constants/regex');
const { mailOptions, sendEmail } = require('../../email/emailConfig');
const emailTemplate = require('../../email/emailTemplate');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwtConst = require('../../constants/jwt');
const User = require('../../schema/user.schema');

exports.checkuserexists = (req, res) => {

  User.find({ email: req.params.email })
    .select('first_name last_name email phone verified role')
    .exec()
    .then(result => {
      if (result.length >= 1) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_EXISTS,
          data: result
        }
        return res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_NOT_EXISTS
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: errorMessage.somethingWentWrong
      };
      res.status(httpStatus.internalServerError).json(errorResponse);
    });
};

exports.signup = (req, res) => {

  let userId = new mongoose.Types.ObjectId();

  if (!credentials.EMAIL_RE.test(req.body.email)) {
    return res.status(httpStatus.internalServerError).json({
      status: errorMessage.status,
      message: invalidConstants.INVALID_EMAIL
    });
  }
  else if (!credentials.PASSWORD_RE.test(req.body.password)) {
    return res.status(httpStatus.internalServerError).json({
      status: errorMessage.status,
      message: invalidConstants.INVALID_PASSWORD
    });
  }

  User.find({ email: req.body.email })
    .exec()
    .then(result => {
      if (result.length >= 1) {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_EXISTS
        }
        return res.status(httpStatus.success).json(response);
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
                status: successMessage.status,
                message: userConstants.USER_REGISTERATION,
              };
              res.status(httpStatus.created).json(response);
            }
          })
          .catch(error => {
            let errorResponse = {
              error: errorMessage.somethingWentWrong
            };
            res.status(httpStatus.internalServerError).json(errorResponse);
          });
      }
    })
};

exports.verifyemail = (req, res) => {

  let userId = req.params.userId;

  User.findByIdAndUpdate(userId, { $set: { verified: true } })
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.EMAIL_VERIFIED
        }
        res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_NOT_EXISTS + ' and ' + userConstants.EMAIL_VERIFICATION_FAILED
        }
        return res.status(httpStatus.success).json(response);
      }
    }).catch(error => {
      let errorResponse = {
        status: errorMessage.error,
        message: errorMessage.somethingWentWrong
      };
      res.status(httpStatus.internalServerError).json(errorResponse);
    });
};

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

          let accessToken = jwt.sign(user, jwtConst.accessSecretKey, { expiresIn: jwtConst.accessKeyExpiresIn });
          let refreshToken = jwt.sign(user, jwtConst.refreshSecretKey, { expiresIn: jwtConst.refreshKeyExpiresIn });

          let response = {
            status: successMessage.status,
            message: userConstants.LOGIN,
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
              return res.status(httpStatus.success).json(response);

            }).catch(error => {
              let errorResponse = {
                error: errorMessage.somethingWentWrong
              };
              res.status(httpStatus.internalServerError).json(errorResponse);
            });
        }
        else {
          let response = {
            status: errorMessage.status,
            message: userConstants.WRONG_PASSWORD
          }
          return res.status(httpStatus.success).json(response);
        }
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_NOT_EXISTS
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: errorMessage.somethingWentWrong
      };
      res.status(httpStatus.internalServerError).json(errorResponse);
    });
};

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
    status: successMessage.status,
    message: userConstants.LOGIN_EMAIL_SEND
  }
  return res.status(httpStatus.success).json(response);
}