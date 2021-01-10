const mongoose = require('mongoose');
const {successMessage, errorMessage, httpStatus} = require('../constants/httpresponse');
const {userConstants} = require('../constants/message');
const {mailOptions, emailTemplate, forgetPasswordTemplate, sendEmail} = require('../config/email');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const User = require('../schema/user.schema');
const forgetPasswordSchema = require('../schema/forgetpassword.schema');

exports.checkuserexists = (req, res, next) => {

  User.find({email: req.params.email})
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
      let response = {
        status : successMessage.status,
        message: userConstants.USER_NOTE_EXISTS
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

  let userId = req.params.userId;

  User.findById(userId)
  .exec()
  .then(result => {
    if(result){
      let link = `http://localhost:8000/api/user/verifyemail/${userId}`
      mailOptions.subject = "Email Verification"
      mailOptions.to = result.email;
      mailOptions.html = emailVerificationTemplate(link)
      sendEmail(mailOptions);
      let response = {
        status:successMessage.status,
        message: userConstants.VERIFICATION_CODE_SEND,
        verification_code_send: true
      };
      res.status(httpStatus.success).json(response);
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

exports.verifyemail = (req, res, next) => {

  let userId = req.params.userId;
  User.findById(userId)
  .then(result => {
    if(result){
      return User.updateOne({_id:userId}, {$set: {verified: true}})
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
    else{
      let response = {
        status : errorMessage.status,
        message: userConstants.USER_NOT_EXISTS+ ' and '+ userConstants.EMAIL_VERIFICATION_FAILED
      }
      return res.status(httpStatus.success).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      status:errorMessage.error,
    };
    res.status(200).json(errorResponse);
  });
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
          role:result.role,
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

exports.forgetpassword = (req, res, next) => {

  let useremail = req.params.email; 

  User.findOne({email:useremail})
  .exec()
  .then(result => {
    if(result){
      const new_code = new mongoose.Types.ObjectId();
      const forgetPassword = new forgetPasswordSchema({
        _id: new mongoose.Types.ObjectId(),
        code: new_code,
        email: useremail,
      });
      forgetPassword.save()
      .then(result => {
        if(result){
          let link = `http://localhost:8000/api/user/setnewpassword/${useremail}/${new_code}`
          mailOptions.subject = "Forget Password";
          mailOptions.to = useremail;
          mailOptions.html = forgetPasswordTemplate(link);
          sendEmail(mailOptions);
          let response = {
            status:successMessage.status,
            message: userConstants.FORGET_PASSWORD,
          };
          res.status(httpStatus.success).json(response);
        }
      })
      .catch(error => {
        let errorResponse = {
          error: errorMessage.somethingWentWrong + 1
        };
        res.status(httpStatus.internalServerError).json(errorResponse); 
      });
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
      error: errorMessage.somethingWentWrong + 2
    };
    res.status(httpStatus.internalServerError).json(errorResponse); 
  });
};


// exports.forgetpass2 = (req, res, next) => {

//   let codeBody = req.params.code;
//   let emailbody = req.params.email;

//   forgetPasswordSchema.findOne({email: emailBody})
//   .exec()
//   .then(result => {
//     if(result){
//       let codeResult = result.code;
//       let emailResult = result.email;
//       if(codeResult==codeBody && emailResult==emailBody){
//         User.findById(userBody)
//         .then(result => {
//           if(result){
//             return User.updateOne({_id:userBody}, {$set: {verified: true}})
//           }
//         })
//         .then(result => {
//           if(result){
//             let response = {
//               status : successMessage.status,
//               message: userConstants.EMAIL_VERIFIED
//             }
//             res.status(httpStatus.success).json(response);
//           }
//         })
//         .catch(error => {
//           let errorResponse = {
//             status:errorMessage.error,
//             message: userConstants.EMAIL_VERIFICATION_FAILED
//           };
//           res.status(200).json(errorResponse);
//         });
//       }
//     }
//   })
//   .catch(error => {
//     let errorResponse = {
//       error: errorMessage.somethingWentWrong
//     };
//     res.status(200).json(errorResponse);
//   })
// };
