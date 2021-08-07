const mongoose = require('mongoose');

const { successMessage, errorMessage, httpStatus } = require('../constants/httpresponse');
const { connectionConstants } = require('../constants/message');

const { mailOptions, sendEmail } = require('../email/emailConfig');
const emailTemplate = require('../email/emailTemplate');

const User = require('../schema/user.schema');

exports.follow = (req, res, next) => {

  userId = req.user.id;
  follow = req.body.follow;

  User.findByIdAndUpdate(
    userId,
    { $push: { following: follow } },
    { safe: true, upsert: true },
  )
    .then(result => {
      if (result) {
        let response = {
          status: successMessage.status,
          message: connectionConstants.FOLLOW,
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        status: errorMessage.status,
        message: errorMessage.somethingWentWrong
      };
      res.status(httpStatus.internalServerError).json(errorResponse);
    });
};
