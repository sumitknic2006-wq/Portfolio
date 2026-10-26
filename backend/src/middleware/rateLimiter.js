import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Standard API rate limiter for general endpoints
 * Automatically skipped in development and test environments to prevent local lockouts
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.isDevelopment ? 5000 : env.RATE_LIMIT_MAX_REQUESTS,
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
  skip: (req) => {
    // Skip in test or development mode for localhost / local IP requests
    if (env.isTest || env.isDevelopment) {
      return true;
    }
    return false;
  },
});

/**
 * Dedicated rate limiter for AI Assistant queries to protect costs & abuse
 */
export const assistantLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isDevelopment ? 200 : env.ASSISTANT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many assistant queries from this IP address. Please wait a few minutes before asking more questions.',
      429,
      null,
      'ASSISTANT_RATE_LIMIT_EXCEEDED'
    );
  },
  skip: () => env.isTest,
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

/**
 * Strict rate limiter for admin authentication to mitigate brute-force attempts
 */
export const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isDevelopment ? 50 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many administrative login attempts. Please wait 15 minutes before retrying.',
      429,
      null,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  },
  skip: () => env.isTest,
});


