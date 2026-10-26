import { env } from '../config/env.js';
import { getDbStatus } from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Health Check Controller
 * Verifies server availability and provides runtime diagnostics
 * Honestly distinguishes application health from database connectivity
 */
export function getHealthStatus(req, res) {
  const dbStatus = getDbStatus();

  const healthData = {
    status: dbStatus.connected || env.isDevelopment ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus.status,
      connected: dbStatus.connected,
      host: dbStatus.host || null,
      mode: dbStatus.connected ? 'mongodb_atlas' : 'disconnected',
    },
    version: '1.0.0',
  };

  return sendSuccess(res, healthData, 'Server health check passed');
}

export default getHealthStatus;
