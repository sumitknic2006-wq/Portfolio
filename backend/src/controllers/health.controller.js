import mongoose from 'mongoose';

/**
 * Health Check Controller
 * Verifies server availability and provides runtime diagnostics
 */
export function getHealthStatus(req, res) {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStatus = dbStates[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      connected: mongoose.connection.readyState === 1,
    },
    version: '1.0.0',
  });
}
