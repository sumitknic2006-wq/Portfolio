import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// 1. Helmet Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS configuration restricted to configured frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile tools, curl, server-to-server tests)
      if (!origin) return callback(null, true);

      if (
        env.ALLOWED_ORIGINS.includes(origin) ||
        origin === env.CLIENT_ORIGIN ||
        env.isDevelopment ||
        env.isTest
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' blocked by CORS security policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Cookie and Body parsing with sensible limits
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Direct root health endpoint for infrastructure and load-balancer probes
app.use('/health', healthRoutes);

// 5. Versioned API routes with standard rate limiting
app.use('/api/v1', apiLimiter, apiRouter);

// 6. 404 Handler for unknown routes
app.use(notFound);

// 7. Centralized Error Handler
app.use(errorHandler);

export default app;
