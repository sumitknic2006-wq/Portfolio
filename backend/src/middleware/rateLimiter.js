import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Standard API rate limiter for general endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many requests from this IP address. Please try again later.',
      429,
      null,
      'RATE_LIMIT_EXCEEDED'
    );
  },
  skip: () => env.isTest, // Disable rate limit in automated tests
});

/**
 * Strict rate limiter for contact submissions to protect against spam
 */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many contact inquiries from this IP address. Please try again after 15 minutes.',
      429,
      null,
      'CONTACT_RATE_LIMIT_EXCEEDED'
    );
  },
  skip: () => env.isTest,
});
