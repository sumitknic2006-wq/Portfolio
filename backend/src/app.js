import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security and CORS configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server tests)
    if (!origin || origin === allowedOrigin || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Direct root health endpoint for monitoring probes
app.use('/health', healthRoutes);

// Versioned API routes
app.use('/api/v1', apiRouter);

// 404 handler for unrecognized routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
