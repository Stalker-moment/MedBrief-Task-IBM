import { Router, Request, Response } from 'express';
import { env } from '../config/env.js';
import { OrchestratorService } from '../services/orchestrator.service.js';

export function createProvidersRouter(orchestrator: OrchestratorService): Router {
  const router = Router();

  router.get('/api/v1/providers', (_req: Request, res: Response) => {
    const providers = orchestrator.getProvidersStatus();
    const bothConfigured = providers.every((p) => p.configured);

    res.status(200).json({
      providers,
      supportsCompare: bothConfigured,
      fallbackAllowed: env.ALLOW_PROVIDER_FALLBACK,
    });
  });

  return router;
}
