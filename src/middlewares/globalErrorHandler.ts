import { ErrorRequestHandler } from 'express';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || 'Something went wrong!';

  // Handle Mongoose Duplicate Key Error
  if (err?.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources: [
      {
        path: '',
        message: err?.message || 'Unknown error',
      },
    ],
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
