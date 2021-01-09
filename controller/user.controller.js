const mongoose = require('mongoose');
const {successMessage, errorMessage, httpStatus} = require('../constants/httpresponse');
const {userConstants} = require('../constants/message');
const {mailOptions, emailTemplate, sendEmail} = require('../config/email');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const User = require('../schema/user.schema');
const VerificationCode = require('../schema/verificationcode.schema');

exports.checkuserexists = (req, res, next) => {

  User.find({email: req.params.email})
  .exec()
  .then(result => {
    if(result.length >= 1){
      let response = {
        status : successMessage.status,
        message: userConstants.USER_EXISTS
      }
      return res.status(httpStatus.success).json(response);
    }
    else{
      let response = {
        status : errorMessage.status,
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
  
  User.find({email:req.body.email})
  .exec()
  .then(result => {
    if(result.length >= 1){
      let response = {
        status : errorMessage.status,
        message: userConstants.USER_EXISTS
      }
      return res.status(httpStatus.success).json(response);
    }
    else{
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.body.username,
        password: passwordHash.generate(req.body.password),
        phone: req.body.phone
      });
    
      user.save()
      .then(result => {
        if(result){
          let response = {
            status:successMessage.status,
            message: userConstants.USER_REGISTERATION,
            user_id: user._id
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

exports.sendemailverificationcode = (req, res, next) => {

  User.findById(req.params.userId)
  .exec()
  .then(result => {
    if(result.length < 1){
      let response = {
        status : errorMessage.status,
        message: userConstants.USER_NOT_EXISTS
      }
      return res.status(httpStatus.success).json(response);
    }
    else{    
      VerificationCode.findOne({user:req.params.userId})
      .exec()
      .then(result => {
        if(result){
          let response = {
            status:successMessage.status,
            message: userConstants.VERIFICATION_CODE_ALREADY_SEND,
            verification_code_already_send: true,
          };
          res.status(httpStatus.success).json(response);
        }
        else{
          const new_code = new mongoose.Types.ObjectId();
          const verification_code = new VerificationCode({
            _id: new mongoose.Types.ObjectId(),
            code: new_code,
            user: req.params.userId,
          });
          verification_code.save()
          .then(result => {
            if(result){
              let link = `http://localhost:8000/api/user/verifyemail/${new_code}/${req.params.userId}`
              mailOptions.to = "sagar@yopmail.com";
              mailOptions.html = emailTemplate(link)
              sendEmail(mailOptions);

              let response = {
                status:successMessage.status,
                message: userConstants.VERIFICATION_CODE_SEND,
                verification_code_send: true
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
  })
};

exports.verifyemail = (req, res, next) => {

  let codeBody = req.params.code;
  let userBody = req.params.user;

  VerificationCode.findOne({user: userBody})
  .exec()
  .then(result => {
    if(result){
      let codeResult = result.code;
      let userResult = result.user;
      if(codeResult==codeBody && userResult==userBody){
        User.findById(userBody)
        .then(result => {
          if(result){
            return User.updateOne({_id:userBody}, {$set: {verified: true}})
          }
        })
        .then(result => {
          if(result){
            let response = {
              status : successMessage.status,
              message: userConstants.EMAIL_VERIFIED
            }
            res.status(httpStatus.success).json(response);
          }
        })
        .catch(error => {
          let errorResponse = {
            status:errorMessage.error,
            message: userConstants.EMAIL_VERIFICATION_FAILED
          };
          res.status(200).json(errorResponse);
        });
      }
    }
  })
  .catch(error => {
    let errorResponse = {
      error: errorMessage.somethingWentWrong
    };
    res.status(200).json(errorResponse);
  })
};

exports.resendemailverificationcode = (req, res, next) => {

  User.findById(req.params.userId)
  .exec()
  .then(result => {
    if(result.length < 1){
      let response = {
        status : errorMessage.status,
        message: userConstants.USER_NOT_EXISTS
      }
      return res.status(httpStatus.success).json(response);
    }
    else{    
      VerificationCode.findOne({user:req.params.userId})
      .exec()
      .then(result => {
        if(result){
          return VerificationCode.updateOne({_id:req.params.userId}, {$set:{code:mongoose.Types.ObjectId()}})
        }
      })
      .then(result => {
        if(result){
          let response = {
            status:successMessage.status,
            message: userConstants.VERIFICATION_CODE_RESEND,
            verification_code_resend: true
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
};

exports.login = (req, res, next) => {
  
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  
  User.findOne({email:userEmail})
  .exec()
  .then(result => {
    if(result){
      let isAuthenticated = passwordHash.verify(userPassword, result.password);
      if(isAuthenticated){
        let user = {
          id:result._id,
          first_name:result.first_name,
          last_name:result.last_name,
          email:result.email,
        }
        let accessToken = jwt.sign(user,"access", {expiresIn:"1d"});
        let refreshToken = jwt.sign(user,"refresh", {expiresIn:"7d"});
        let response = {
          status : successMessage.status,
          message: userConstants.LOGIN,
          access_token: accessToken,
          refresh_token: refreshToken
        };
        return res.status(httpStatus.success).json(response);
      }
    }
    else{
      let response = {
        status : errorMessage.status,
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
