import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { OrchestratorService } from '../src/services/orchestrator.service.js';
import { MedicalSummaryProvider, ProviderAnalyzeTask, ProviderExecutionResult } from '../src/services/providers/types.js';
import { MOCK_STRUCTURED_RESULT } from './fixtures.js';

class MockApiProvider implements MedicalSummaryProvider {
  constructor(public readonly name: 'gemini' | 'deepseek', public readonly modelName: string) {}
  isConfigured(): boolean {
    return true;
  }
  async analyze(task: ProviderAnalyzeTask): Promise<ProviderExecutionResult> {
    return {
      provider: this.name,
      model: this.modelName,
      latencyMs: 120,
      result: MOCK_STRUCTURED_RESULT,
    };
  }
}

describe('Express API Endpoints', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    const mockGemini = new MockApiProvider('gemini', 'gemini-3.8-flash');
    const mockDeepSeek = new MockApiProvider('deepseek', 'deepseek-v4-flash');
    const mockOrchestrator = new OrchestratorService(mockGemini, mockDeepSeek);

    app = createApp({ orchestrator: mockOrchestrator });
  });

  describe('GET /health', () => {
    it('returns 200 OK with service metadata and uptime', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('medibrief-api');
      expect(typeof res.body.uptimeSeconds).toBe('number');
      expect(res.headers['x-request-id']).toBeDefined();
    });

    it('allows CORS from localhost frontend', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });

  describe('GET /api/v1/providers', () => {
    it('returns list of configured providers and compare capabilities', async () => {
      const res = await request(app).get('/api/v1/providers');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.providers)).toBe(true);
      expect(res.body.providers.length).toBe(2);
      expect(res.body.supportsCompare).toBe(true);
    });
  });

  describe('POST /api/v1/medical-records/analyze', () => {
    it('successfully analyzes a valid medical record note', async () => {
      const res = await request(app)
        .post('/api/v1/medical-records/analyze')
        .send({
          recordText: 'Pasien kontrol rutin hipertensi dengan tensi 160/90 mmHg. Obat amlodipine 10mg.',
          provider: 'gemini',
          audience: 'both',
          language: 'id',
        });

      expect(res.status).toBe(200);
      expect(res.body.requestId).toBeDefined();
      expect(res.body.requestedProvider).toBe('gemini');
      expect(res.body.actualProvider).toBe('gemini');
      expect(res.body.safetyDisclaimer).toContain('PERINGATAN PENTING');
      expect(res.body.validatedResult).toEqual(MOCK_STRUCTURED_RESULT);
      expect(res.body.completedResults.length).toBe(1);
    });

    it('returns 400 Bad Request when recordText is under 20 characters', async () => {
      const res = await request(app)
        .post('/api/v1/medical-records/analyze')
        .send({
          recordText: 'Singkat sekali.',
          provider: 'gemini',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.issues[0]?.message).toContain('minimal 20 karakter');
    });

    it('returns 400 Bad Request on malformed JSON payload', async () => {
      const res = await request(app)
        .post('/api/v1/medical-records/analyze')
        .set('Content-Type', 'application/json')
        .send('{ invalidJson:');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('MALFORMED_JSON');
    });

    it('returns 404 for undefined routes', async () => {
      const res = await request(app).get('/api/v1/non-existent-route');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
