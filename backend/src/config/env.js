import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

/**
 * Validated and normalized environment configuration for Phase 4
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
  // MongoDB Atlas or local connection string
  MONGODB_URI: process.env.MONGODB_URI || '',
  // Explicit flag allowing development fixtures ONLY when DB is disconnected in development
  ALLOW_DEV_FIXTURES: process.env.ALLOW_DEV_FIXTURES === 'true' && process.env.NODE_ENV !== 'production',
  // Rate limiting defaults
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 1000,
  CONTACT_RATE_LIMIT_MAX: parseInt(process.env.CONTACT_RATE_LIMIT_MAX, 10) || 20, // 20 contact requests per window
  ASSISTANT_RATE_LIMIT_MAX: parseInt(process.env.ASSISTANT_RATE_LIMIT_MAX, 10) || 30, // 30 assistant queries per window

  // AI Assistant Provider Configuration (Phase 7)
  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini', // 'gemini' | 'openai' | 'mock'
  AI_API_KEY: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-3.5-flash-lite',
  AI_MAX_OUTPUT_TOKENS: parseInt(process.env.AI_MAX_OUTPUT_TOKENS, 10) || 600,
  AI_TIMEOUT_MS: parseInt(process.env.AI_TIMEOUT_MS, 10) || 60000,

  // Admin Authentication & JWT Configuration (Phase 9)
  JWT_SECRET: process.env.JWT_SECRET || 'sumit-portfolio-dev-jwt-secret-key-change-in-production-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.CONTACT_RECEIVER_EMAIL || 'sumitknic2006@gmail.com',
  ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Sumit2026!',

  // Email Notifications Configuration (Phase 9 - Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Sumit Portfolio <onboarding@resend.dev>',
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'sumitknic2006@gmail.com',
  APP_URL: process.env.APP_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // DSA Explorer & Coding Profiles Configuration
  CODEFORCES_HANDLE: process.env.CODEFORCES_HANDLE || 'sumitknic567',
  LEETCODE_USERNAME: process.env.LEETCODE_USERNAME || '25001122',
  DSA_AUTO_SYNC_ENABLED: process.env.DSA_AUTO_SYNC_ENABLED !== 'false',
  DSA_SYNC_INTERVAL_MINUTES: parseInt(process.env.DSA_SYNC_INTERVAL_MINUTES, 10) || 360,
  CRON_SECRET: process.env.CRON_SECRET || 'dev_cron_secret_sumit_portfolio_dsa',
};

export default env;
