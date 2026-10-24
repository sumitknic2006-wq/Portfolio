import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

/**
 * Validated and normalized environment configuration
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isTest: process.env.NODE_ENV === 'test',
  PORT: parseInt(process.env.PORT, 10) || 5001,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  // Planned for Phase 4 database connection
  MONGODB_URI: process.env.MONGODB_URI || '',
  // Rate limiting defaults
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  CONTACT_RATE_LIMIT_MAX: parseInt(process.env.CONTACT_RATE_LIMIT_MAX, 10) || 5, // 5 requests per window
};

export default env;
