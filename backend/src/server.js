import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

async function startServer() {
  // In Phase 3: Connect to MongoDB only if explicitly configured; runs gracefully disconnected otherwise
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 [Server] Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`🩺 [Server] Health check: http://localhost:${env.PORT}/health`);
    console.log(`📚 [Server] API base route: http://localhost:${env.PORT}/api/v1`);
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
