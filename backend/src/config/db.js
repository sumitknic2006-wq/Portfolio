import mongoose from 'mongoose';
import { env } from './env.js';

let isListenersAttached = false;

/**
 * Safely extract host without leaking credentials or database auth params
 */
function getSafeHost(uri) {
  try {
    const url = new URL(uri);
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch {
    return 'MongoDB Host';
  }
}

/**
 * Connect to MongoDB database
 * Enforces strict production validation and event-driven reconnection tracking.
 */
export async function connectDB(customUri = null) {
  const uri = customUri || env.MONGODB_URI;

  if (!uri) {
    if (env.isProduction) {
      const errorMsg = 'FATAL: MONGODB_URI environment variable is required in production';
      console.error(`❌ [MongoDB] ${errorMsg}`);
      throw new Error(errorMsg);
    }
    console.warn(
      '⚠️ [MongoDB] MONGODB_URI not specified. Running in disconnected mode (allowed only in local dev).'
    );
    return null;
  }

  // Attach connection lifecycle events once
  if (!isListenersAttached) {
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB] Connection lost. Attempting automated reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ [MongoDB] Reconnection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ [MongoDB] Internal driver error: ${err.message}`);
    });

    isListenersAttached = true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: !env.isProduction, // Avoid automatic index builds on production startup
    });

    const safeHost = getSafeHost(uri);
    console.log(`✅ [MongoDB] Connected successfully to: ${safeHost}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection failure: ${error.message}`);
    if (env.isProduction) {
      throw error;
    }
    return null;
  }
}

/**
 * Graceful database disconnection
 */
export async function disconnectDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('ℹ️ [MongoDB] Database connection cleanly closed.');
    }
  } catch (error) {
    console.error(`❌ [MongoDB] Error during disconnection: ${error.message}`);
  }
}

/**
 * Get current database status
 */
export function getDbStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateCode = mongoose.connection.readyState;
  return {
    connected: stateCode === 1,
    status: states[stateCode] || 'unknown',
    host: stateCode === 1 ? mongoose.connection.host : null,
  };
}

export default {
  connectDB,
  disconnectDB,
  getDbStatus,
};
