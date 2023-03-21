const jwt = require('jsonwebtoken');
const { message, statusCode } = require('../../src/constants');

/* This is a middleware function that is used to verify the token. */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: message.UNAUTHENTICATED
    });
  }
}