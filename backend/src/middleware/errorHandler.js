/**
 * Centralized Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  
  console.error(`[Error] ${req.method} ${req.originalUrl} - ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
}
