const mongoose = require('mongoose');
const { httpStatus, status } = require('../constants/httpresponse');
const { openConstants } = require('../constants/message');
const Contact = require('../schema/contact.schema');

exports.contact = (req, res, next) => {
  const contact = new Contact({
    _id: new mongoose.Types.ObjectId(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
  });

  contact.save()
    .then(result => {
      if (result) {
        let response = {
          status: status.success,
          message: openConstants.MESSAGE_SEND,
        };
        res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: status.failed,
          message: openConstants.MESSAGE_SEND_FAILED,
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
};
