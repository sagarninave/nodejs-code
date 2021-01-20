const jwt = require('jsonwebtoken');
const httpStatus = require('./../constants/httpresponse');
const jwtConst = require('./../constants/jwt');
module.exports = (req, res, next) => {
  try {
    // Get the token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtConst.accessSecretKey);
    // Pass the user data to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(httpStatus.internalServerError).json({
      message: "Invalid Authentication"
    });
  }
}