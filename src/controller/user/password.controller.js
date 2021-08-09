const mongoose = require('mongoose');
const { httpStatus, status } = require('../../constants/httpresponse');
const { userConstants } = require('../../constants/message');
const { mailOptions, sendEmail } = require('../../email/emailConfig');
const emailTemplate = require('../../email/emailTemplate');
const passwordHash = require('password-hash');
const User = require('../../schema/user.schema');
const forgetPassword = require('../../schema/forgetpassword.schema');

exports.forgetpassword = (req, res) => {

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
                      status: status.success,
                      message: userConstants.FORGET_PASSWORD,
                    };
                    res.status(httpStatus.success).json(response);
                  }
                })
                .catch(error => {
                  let errorResponse = {
                    error: status.somethingWentWrong
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
                      status: status.success,
                      message: userConstants.FORGET_PASSWORD,
                    };
                    res.status(httpStatus.success).json(response);
                  }
                })
                .catch(error => {
                  let errorResponse = {
                    error: status.somethingWentWrong
                  };
                  res.status(httpStatus.internalServerError).json(errorResponse);
                });
            }
          })
      }
      else {
        let response = {
          status: status.failed,
          message: userConstants.USER_NOT_EXISTS
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: status.somethingWentWrong
      };
      res.status(httpStatus.internalServerError).json(errorResponse);
    });
};

exports.setnewpassword = (req, res) => {

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
                  status: status.success,
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
            status: status.failed,
            message: userConstants.FORGET_PASSWORD_CODE_MISMATCH
          }
          res.status(httpStatus.success).json(response);
        }
      }
      else {
        let response = {
          status: status.failed,
          message: userConstants.FORGET_PASSWORD_LINK_RESEND
        }
        res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: status.somethingWentWrong
      };
      res.status(200).json(errorResponse);
    })
};

exports.changepassword = (req, res) => {

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
                    status: status.success,
                    message: userConstants.PASSWORD_CHANGED
                  }
                  res.status(httpStatus.success).json(response);
                }
                else {
                  let response = {
                    status: status.failed,
                    message: userConstants.PASSWORD_NOT_MATCHED
                  }
                  res.status(httpStatus.success).json(response);
                }
              })
              .catch(error => {
                let errorResponse = {
                  error: status.somethingWentWrong
                };
                res.status(500).json(errorResponse);
              })
          }
          else {
            let response = {
              status: status.failed,
              message: userConstants.PASSWORD_NOT_MATCHED
            }
            res.status(httpStatus.success).json(response);
          }
        }
        else {
          let response = {
            status: status.failed,
            message: userConstants.OLD_PASSWORD_MISMATCH
          }
          res.status(httpStatus.success).json(response);
        }
      }
      else {
        let response = {
          status: status.failed,
          message: userConstants.USER_NOT_EXISTS
        }
        res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        error: status.somethingWentWrong
      };
      res.status(500).json(errorResponse);
    })
};