import { ErrorRequestHandler } from 'express';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';

  // Simplify error structure for this example
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
