/**
 * Standard API Response Utilities
 * Enforces consistent JSON formatting across all REST endpoints
 */

export function sendSuccess(res, data = null, message = null, statusCode = 200, meta = null) {
  const payload = {
    success: true,
  };

  if (message) payload.message = message;
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;

  return res.status(statusCode).json(payload);
}

export function sendError(res, message, statusCode = 500, details = null, code = null) {
  const payload = {
    success: false,
    error: {
      message,
    },
  };

  if (code) payload.error.code = code;
  if (details) payload.error.details = details;

  return res.status(statusCode).json(payload);
}
