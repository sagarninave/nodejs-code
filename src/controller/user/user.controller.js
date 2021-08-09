const { httpStatus, status } = require('../../constants/httpresponse');
const { userConstants } = require('../../constants/message');
const User = require('../../schema/user.schema');

exports.getalluser = (req, res) => {
  User.find()
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: status.success,
          message: userConstants.USERS,
          user: result
        }
        return res.status(httpStatus.success).json(response);
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

exports.getuser = (req, res) => {
  User.findById(req.params.id)
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: status.success,
          message: userConstants.USER_FOUND,
          user: result
        }
        return res.status(httpStatus.success).json(response);
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