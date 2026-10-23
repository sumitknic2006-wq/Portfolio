import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;

async function startServer() {
  // Connect to database if URI provided
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 [Server] Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`🩺 [Server] Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n🛑 [Server] Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('🚪 [Server] HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10s if graceful fails
    setTimeout(() => {
      console.error('⚠️ [Server] Forceful shutdown initiated after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
