import { sendError } from '../utils/apiResponse.js';

/**
 * 404 Route Not Found Middleware
 */
export function notFound(req, res, next) {
  return sendError(
    res,
    `API Route not found: ${req.method} ${req.originalUrl}`,
    404,
    null,
    'ROUTE_NOT_FOUND'
  );
}

export default notFound;
