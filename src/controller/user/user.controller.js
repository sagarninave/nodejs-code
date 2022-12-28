const { message, statusCode } = require('../../constants');
const User = require('../../schema/user.schema');

exports.getalluser = (req, res) => {
  User.find()
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: message.SUCCESS,
          message: message.USERS,
          user: result
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
};

exports.getuser = (req, res) => {
  User.findById(req.params.id)
    .select('_id first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: message.SUCCESS,
          message: message.USER_FOUND,
          user: result
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
};