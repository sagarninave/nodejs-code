const successMessage = { 
  status: 'success' 
};

const errorMessage = { 
  status: 'failed',
  somethingWentWrong: 'something went wrong',
};

const httpStatus = {
  success: 200,
  internalServerError: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  bad: 400,
  nocontent: 204,
};

module.exports = {
  successMessage,
  errorMessage,
  httpStatus
};