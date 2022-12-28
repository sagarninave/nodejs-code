const { httpStatus, status } = require('../../constants/httpresponse');
const { message } = require('../../constants/message');
const User = require('../../schema/user.schema');

exports.userprofile = (req, res) => {
  let userId = req.user.id;
  User.findById(userId)
    .select('first_name last_name email username phone avatar address gender dob social role')
    .exec()
    .then(result => {
      if (result) {
        let response = {
          status: status.success,
          message: message.USER_PROFILE,
          user: result
        }
        return res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: status.failed,
          message: message.USER_NOT_EXISTS
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

exports.edituserprofile = (req, res) => {
  let userId = req.user.id;
  let user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
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
          status: status.success,
          message: message.USER_PROFILE_UPDATE
        }
        res.status(httpStatus.success).json(response);
      }
      else {
        let response = {
          status: status.failed,
          message: message.USER_PROFILE_UPDATE_FAILED
        }
        return res.status(httpStatus.success).json(response);
      }
    })
    .catch(error => {
      let errorResponse = {
        status: status.failed,
        message: status.somethingWentWrong
      };
      res.status(200).json(errorResponse);
    });
};

exports.uploadprofilepicture = async (req, res) => {

  if (req.file.size > 1000000) {
    let response = {
      status: status.failed,
      message: message.PROFILE_PHOTO_SIZE
    }
    return res.status(httpStatus.internalServerError).json(response);
  }
  else {
    try {
      const cloudresponse = await cloudinary.uploader.upload(req.file.path);
      User.updateOne({ _id: req.user.id }, { $set: { avatar: cloudresponse.url } })
        .then(result => {
          if (result) {
            let response = {
              status: status.success,
              message: message.PROFILE_PHOTO_UPLOAD
            }
            res.status(httpStatus.success).json(response);
          }
          else {
            let response = {
              status: status.failed,
              message: message.PROFILE_PHOTO_UPLOAD_FAILED
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
    }
    catch (e) {
      console.log(e)
    }
  }
};