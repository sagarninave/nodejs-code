const jwt = require('jsonwebtoken');
const httpStatus = require('./../constants/httpresponse');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);
    req.user = decoded;
    next();
  } 
  catch (error) {
    res.status(httpStatus.internalServerError).json({
      message: "Unauthenticated User"
    });
  }
}