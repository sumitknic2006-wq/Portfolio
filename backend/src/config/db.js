import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Supports both local MongoDB instances and MongoDB Atlas cloud clusters.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI not specified in environment. Running in disconnected mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    // Do not crash the application during local startup if DB is offline
    return null;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('ℹ️ [MongoDB] Disconnected.');
  } catch (error) {
    console.error(`❌ [MongoDB] Disconnection error: ${error.message}`);
  }
}
