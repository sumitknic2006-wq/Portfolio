import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Health Check Controller
 * Verifies server availability and provides runtime diagnostics
 * Honestly reports MongoDB connection state (does not claim connected when disconnected)
 */
export function getHealthStatus(req, res) {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const dbStatus = dbStates[dbState] || 'disconnected';

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      connected: dbState === 1,
      mode: dbState === 1 ? 'persistent' : 'phase3_standalone_fixtures',
    },
    version: '1.0.0',
  };

  return sendSuccess(res, healthData, 'Server is operational and healthy');
}

export default getHealthStatus;
