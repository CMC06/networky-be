const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  // spread err object into error variable
  let error = {...err};
  // assign error message
  error.message = err.message;

  // Log err to console for dev purposes
  console.log(err);

  // Mongoose bad ObjectID
  if(err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key in database
  if(err.code === 11000) {
    const message = `Duplicate field value entered, already exists in database`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose validation error
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  // Catch all for other errors
  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
}

module.exports = errorHandler;