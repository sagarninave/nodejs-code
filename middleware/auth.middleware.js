const jwt = require('jsonwebtoken');
const httpStatus = require('./../constants/httpresponse');
const jwtConst = require('./../constants/jwt');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtConst.accessSecretKey);
    req.user = decoded;
    next();
  } 
  catch (error) {
    res.status(httpStatus.internalServerError).json({
      message: "Unauthenticated User"
    });
  }
}