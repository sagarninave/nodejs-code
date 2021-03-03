const mongoose = require('mongoose');

const { successMessage, errorMessage, httpStatus } = require('../constants/httpresponse');
const { invalidConstants, userConstants } = require('../constants/message');
const { credentials } = require('../constants/regex');

const { mailOptions, sendEmail } = require('../email/emailConfig');
const emailTemplate = require('../email/emailTemplate');

const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwtConst = require('./../constants/jwt');

const User = require('../schema/user.schema');
const forgetPassword = require('../schema/forgetpassword.schema');

exports.checkuserexists = (req, res, next) => {

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

exports.signup = (req, res, next) => {

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
          avatar: req.body.avatar,
          email: req.body.email,
          username: req.body.username,
          password: passwordHash.generate(req.body.password),
          phone: req.body.phone,
          address: req.body.address,
          gender: req.body.gender,
          dob: req.body.dob,
          social: req.body.social
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

exports.uploadprofilepicture = (req, res, next) => {

  let new_avatar = req.file.destination + '/' + req.file.filename;

  User.findOne({ _id: req.user.id })
    .then(result => {
      if (result) {
        User.updateOne({ _id: req.user.id }, { $set: { avatar: new_avatar } })
          .then(result => {
            if (result) {
              let response = {
                status: successMessage.status,
                message: userConstants.PROFILE_PHOTO_UPLOAD
              }
              res.status(httpStatus.success).json(response);
            }
            else {
              let response = {
                status: errorMessage.status,
                message: userConstants.PROFILE_PHOTO_UPLOAD_FAILED
              }
              res.status(httpStatus.success).json(response);
            }
          })
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_NOT_EXISTS
        }
        res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: errorMessage.somethingWentWrong
      };
      res.status(200).json(errorResponse);
    })
};

exports.verifyemail = (req, res, next) => {

  let userId = req.params.userId;
  User.findById(userId)
    .then(result => {
      if (result) {
        return User.updateOne({ _id: userId }, { $set: { verified: true } })
      }
    })
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
    })
    .catch(error => {
      let errorResponse = {
        status: errorMessage.error,
      };
      res.status(200).json(errorResponse);
    });
};

exports.login = (req, res, next) => {

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
          }
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

          return res.status(httpStatus.success).json(response);
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

exports.recentloginemailsend = (req, res, next) => {
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

exports.forgetpassword = (req, res, next) => {

  let useremail = req.params.email;
  let new_code = new mongoose.Types.ObjectId();

  User.findOne({ email: useremail })
    .exec()
    .then(result => {
      if (result) {
        forgetPassword.findOne({ email: useremail })
          .exec()
          .then(result => {
            if (result) {
              forgetPassword.updateOne({ email: useremail }, { $set: { code: new_code } })
                .then(result => {
                  if (result) {
                    let link = `http://localhost:4200/setnewpassword/${useremail}/${new_code}`
                    mailOptions.subject = "Forget Password";
                    mailOptions.to = useremail;
                    mailOptions.html = emailTemplate.forgetPasswordTemplate(link);
                    sendEmail(mailOptions);
                    let response = {
                      status: successMessage.status,
                      message: userConstants.FORGET_PASSWORD,
                    };
                    res.status(httpStatus.success).json(response);
                  }
                })
                .catch(error => {
                  let errorResponse = {
                    error: errorMessage.somethingWentWrong
                  };
                  res.status(httpStatus.internalServerError).json(errorResponse);
                });
            }
            else {
              const forgetpassword = new forgetPassword({
                _id: new mongoose.Types.ObjectId(),
                code: new_code,
                email: useremail,
              });
              forgetpassword.save()
                .then(result => {
                  if (result) {
                    let link = `http://localhost:4200/setnewpassword/${useremail}/${new_code}`
                    mailOptions.subject = "Forget Password";
                    mailOptions.to = useremail;
                    mailOptions.html = emailTemplate.forgetPasswordTemplate(link);
                    sendEmail(mailOptions);
                    let response = {
                      status: successMessage.status,
                      message: userConstants.FORGET_PASSWORD,
                    };
                    res.status(httpStatus.success).json(response);
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

exports.setnewpassword = (req, res, next) => {

  let user_code = req.body.code;
  let user_email = req.body.email;
  let user_password = req.body.password;

  forgetPassword.findOne({ email: user_email })
    .exec()
    .then(result => {
      if (result) {
        let codeResult = result.code;
        let emailResult = result.email;
        if (codeResult == user_code && emailResult == user_email) {
          User.findOne({ email: user_email })
            .then(result => {
              if (result) {
                let new_password = { password: passwordHash.generate(user_password) }
                return User.updateOne({ _id: result._id }, { $set: new_password })
              }
            })
            .then(result => {
              if (result) {
                let response = {
                  status: successMessage.status,
                  message: userConstants.PASSWORD_CHANGED
                }
                res.status(httpStatus.success).json(response);
              }
            })
            .catch(error => {
              let errorResponse = {
                status: errorMessage.error,
                message: userConstants.PASSWORD_CHANGED_FAILED
              };
              res.status(200).json(errorResponse);
            });
        }
        else {
          let response = {
            status: errorMessage.status,
            message: userConstants.FORGET_PASSWORD_CODE_MISMATCH
          }
          res.status(httpStatus.success).json(response);
        }
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.FORGET_PASSWORD_LINK_RESEND
        }
        res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: errorMessage.somethingWentWrong
      };
      res.status(200).json(errorResponse);
    })
};

exports.changepassword = (req, res, next) => {

  let userId = req.user.id;
  let old_password = req.body.old_password;
  let new_password = req.body.new_password;
  let confirm_password = req.body.confirm_password;

  User.findById(userId)
    .then(result => {
      if (result) {
        let isAuthenticated = passwordHash.verify(old_password, result.password);
        if (isAuthenticated) {
          if (new_password === confirm_password) {
            let set_password = { password: passwordHash.generate(new_password) }
            User.updateOne({ _id: userId }, { $set: set_password })
              .then(result => {
                if (result) {
                  let response = {
                    status: successMessage.status,
                    message: userConstants.PASSWORD_CHANGED
                  }
                  res.status(httpStatus.success).json(response);
                }
                else {
                  let response = {
                    status: errorMessage.status,
                    message: userConstants.PASSWORD_NOT_MATCHED
                  }
                  res.status(httpStatus.success).json(response);
                }
              })
              .catch(error => {
                let errorResponse = {
                  error: errorMessage.somethingWentWrong
                };
                res.status(500).json(errorResponse);
              })
          }
          else {
            let response = {
              status: errorMessage.status,
              message: userConstants.PASSWORD_NOT_MATCHED
            }
            res.status(httpStatus.success).json(response);
          }
        }
        else {
          let response = {
            status: errorMessage.status,
            message: userConstants.OLD_PASSWORD_MISMATCH
          }
          res.status(httpStatus.success).json(response);
        }
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_NOT_EXISTS
        }
        res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: errorMessage.somethingWentWrong
      };
      res.status(500).json(errorResponse);
    })
};

exports.getalluser = (req, res, next) => {
  User.find()
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.USERS,
          user: result
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

exports.getuser = (req, res, next) => {
  User.findById(req.params.id)
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_FOUND,
          user: result
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

exports.userprofile = (req, res, next) => {
  let userId = req.user.id;
  User.findById(userId)
    .select('first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_PROFILE,
          user: result
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

exports.edituserprofile = (req, res, next) => {
  let userId = req.user.id;
  let user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
    dob: req.body.dob,
    social: req.body.social
  }
  User.findById(userId)
    .then(result => {
      if (result) {
        return User.updateOne({ _id: userId }, { $set: user })
      }
    })
    .then(result => {
      if (result && result.ok == 1) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_PROFILE_UPDATE
        }
        res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_PROFILE_UPDATE_FAILED
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        status: errorMessage.status,
        message: errorMessage.somethingWentWrong
      };
      res.status(200).json(errorResponse);
    });
};

exports.getalluser = (req, res, next) => {
  User.find()
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      console.log(result)
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.USERS,
          user: result
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

exports.getuser = (req, res, next) => {
  User.findById(req.params.id)
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_FOUND,
          user: result
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

exports.userprofile = (req, res, next) => {
  let userId = req.user.id;
  User.findById(userId)
    .select('first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_PROFILE,
          user: result
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

exports.edituserprofile = (req, res, next) => {
  let userId = req.user.id;
  let user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
    dob: req.body.dob,
    social: req.body.social
  }
  User.findById(userId)
    .then(result => {
      if (result) {
        return User.updateOne({ _id: userId }, { $set: user })
      }
    })
    .then(result => {
      if (result && result.ok == 1) {
        let response = {
          status: successMessage.status,
          message: userConstants.USER_PROFILE_UPDATE
        }
        res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: errorMessage.status,
          message: userConstants.USER_PROFILE_UPDATE_FAILED
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        status: errorMessage.status,
        message: errorMessage.somethingWentWrong
      };
      res.status(200).json(errorResponse);
    });
};
