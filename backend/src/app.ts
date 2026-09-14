import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { requestLoggerMiddleware } from './middleware/logger.js';
import { apiRateLimiter } from './middleware/rate-limiter.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.route.js';
import { createProvidersRouter } from './routes/providers.route.js';
import { createAnalyzeRouter } from './routes/analyze.route.js';
import { OrchestratorService } from './services/orchestrator.service.js';

export interface AppOptions {
  orchestrator?: OrchestratorService;
}

export function createApp(options: AppOptions = {}): Express {
  const app = express();
  const orchestrator = options.orchestrator || new OrchestratorService();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // API service
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS allowlist supporting multiple domains and wildcards (e.g. Vercel)
  const configuredOrigins = env.WEB_ORIGIN
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedOrigins = [...configuredOrigins];
  if (!allowedOrigins.includes('http://localhost:3000')) {
    allowedOrigins.push('http://localhost:3000');
  }
  if (!allowedOrigins.includes('http://127.0.0.1:3000')) {
    allowedOrigins.push('http://127.0.0.1:3000');
  }

  const isOriginAllowed = (origin: string): boolean => {
    return allowedOrigins.some((pattern) => {
      if (pattern === '*' || pattern === origin) return true;
      if (pattern.includes('*')) {
        const regexStr = '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*') + '$';
        return new RegExp(regexStr).test(origin);
      }
      return false;
    });
  };

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked for origin: ${origin}`));
        }
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-request-id', 'Authorization'],
      credentials: true,
      maxAge: 86400,
    })
  );

  // Request identification & timing
  app.use(requestIdMiddleware);

  // Body parsing with safe size limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Privacy-safe request logger
  app.use(requestLoggerMiddleware);

  // Routes
  app.use(healthRouter);

  // Rate-limited API v1 routes
  app.use(apiRateLimiter);
  app.use(createProvidersRouter(orchestrator));
  app.use(createAnalyzeRouter(orchestrator));

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Rute '${req.method} ${req.path}' tidak ditemukan pada layanan MediBrief API.`,
        requestId: req.id,
      },
    });
  });

  // Centralized Error Handling
  app.use(errorHandlerMiddleware);

  return app;
}
