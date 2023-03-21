const { message, statusCode } = require('../../constants');
const User = require('../../schema/user.schema');

/* This is a function that is used to get all the users from the database. */
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

/* This is a function that is used to get a single user from the database. */
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