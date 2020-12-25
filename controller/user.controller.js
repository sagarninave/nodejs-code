const mongoose = require('mongoose');
const {successMessage, errorMessage, httpStatus} = require('../constants/httpresponse');
const {userConstants} = require('../constants/message');
const { param } = require('../routes/user.route');
const User = require('../schema/user.schema');

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
        password: req.body.password,
        phone: req.body.phone,
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
          error: error
        };
        res.status(httpStatus.internalServerError).json(errorResponse); 
      });
    }
  })
};