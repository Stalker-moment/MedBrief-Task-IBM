import { Router, Request, Response, NextFunction } from 'express';
import { RecordAnalyzeRequestSchema } from '@medibrief/shared';
import { OrchestratorService } from '../services/orchestrator.service.js';

export function createAnalyzeRouter(orchestrator: OrchestratorService): Router {
  const router = Router();

  router.post(
    '/api/v1/medical-records/analyze',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Validate request body
        const validatedPayload = RecordAnalyzeRequestSchema.parse(req.body);

        // Execute orchestrated analysis
        const responseEnvelope = await orchestrator.analyze(validatedPayload, req.id);

        res.status(200).json(responseEnvelope);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
