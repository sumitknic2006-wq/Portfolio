import { env } from '../config/env.js';

/**
 * Centralized Application Error Handling Middleware
 * Ensures safe responses in production without exposing sensitive internals
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Safe logging in server output (avoid logging private credentials/payloads)
  if (!env.isTest) {
    console.error(`[Error] ${req.method} ${req.originalUrl} - ${err.message}`);
    if (env.isDevelopment && err.stack) {
      console.error(err.stack);
    }
  }

  const response = {
    success: false,
    error: {
      message: err.isOperational || env.isDevelopment
        ? err.message
        : 'An unexpected internal server error occurred',
    },
  };

  if (err.code) {
    response.error.code = err.code;
  }

  // Only expose stack trace in non-production environments
  if (env.isDevelopment && err.stack) {
    response.error.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

export default errorHandler;
