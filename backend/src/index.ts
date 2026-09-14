import { createApp } from './app.js';
import { env } from './config/env.js';
import { SafeLogger } from './middleware/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  SafeLogger.info(`MediBrief Express API running on port ${env.PORT}`, {
    port: env.PORT,
    environment: env.NODE_ENV,
    webOrigin: env.WEB_ORIGIN,
  });
  console.log(`\n🩺 [MediBrief API] Servis backend aktif: http://localhost:${env.PORT}`);
  console.log(`   - Endpoint Health: http://localhost:${env.PORT}/health`);
  console.log(`   - Endpoint Providers: http://localhost:${env.PORT}/api/v1/providers`);
  console.log(`   - Endpoint Analyze: POST http://localhost:${env.PORT}/api/v1/medical-records/analyze\n`);
});

// Graceful shutdown handling
function handleShutdown(signal: string): void {
  SafeLogger.info(`Menerima sinyal ${signal}. Menutup server dengan aman...`);
  server.close(() => {
    SafeLogger.info('Server Express berhasil dihentikan.');
    process.exit(0);
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    SafeLogger.error('Shutdown melebihi batas waktu 10s. Memaksa keluar.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
