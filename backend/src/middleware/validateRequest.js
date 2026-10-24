import { sendError } from '../utils/apiResponse.js';

/**
 * Middleware factory for validating request bodies against Zod schemas
 */
export function validateRequestBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const formattedErrors = issues.map((err) => ({
        field: err.path.join('.') || 'body',
        message: err.message,
      }));

      return sendError(
        res,
        'Invalid request payload',
        400,
        formattedErrors,
        'VALIDATION_ERROR'
      );
    }

    // Replace req.body with the sanitized/parsed data
    req.body = result.data;
    next();
  };
}

export default validateRequestBody;
