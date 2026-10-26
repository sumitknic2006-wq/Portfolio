import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

async function startServer() {
  try {
    // In Phase 4: Connect to MongoDB; throws in production if connection fails
    await connectDB();
    // Safe auto-migration for any legacy DSA problem records lacking provenance
    try {
      const { migrateLegacyProvenance } = await import('./scripts/migrateProvenance.js');
      await migrateLegacyProvenance();
    } catch (migErr) {
      console.warn(`[Server] Legacy provenance migration note: ${migErr.message}`);
    }
  } catch (error) {
    if (env.isProduction) {
      console.error('❌ [Server] Failed to establish required database connection in production. Terminating process.');
      process.exit(1);
    }
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 [Server] Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`🩺 [Server] Health check: http://localhost:${env.PORT}/health`);
    console.log(`📚 [Server] API base route: http://localhost:${env.PORT}/api/v1`);

    // Start automated DSA background scheduler
    import('./services/dsaScheduler.service.js')
      .then(({ dsaSchedulerService }) => dsaSchedulerService.startScheduler())
      .catch((schedErr) => console.warn(`[Server] Scheduler startup note: ${schedErr.message}`));
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ [Server] Port ${env.PORT} is already in use. Retrying in 1s...`);
      setTimeout(() => {
        server.close();
        process.exit(1); // Exit cleanly so file watcher restarts fresh
      }, 1000);
    } else {
      console.error('❌ [Server] Unhandled server error:', err.message);
    }
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n🛑 [Server] Received ${signal}. Starting graceful shutdown...`);
    try {
      const { dsaSchedulerService } = await import('./services/dsaScheduler.service.js');
      dsaSchedulerService.stopScheduler();
    } catch {}

    server.close(async () => {
      console.log('🚪 [Server] HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown fails
    setTimeout(() => {
      console.error('⚠️ [Server] Forceful shutdown initiated after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
