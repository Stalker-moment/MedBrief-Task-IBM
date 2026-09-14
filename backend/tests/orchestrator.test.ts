import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrchestratorService } from '../src/services/orchestrator.service.js';
import { MedicalSummaryProvider, ProviderAnalyzeTask, ProviderExecutionResult } from '../src/services/providers/types.js';
import { MOCK_STRUCTURED_RESULT } from './fixtures.js';
import { env } from '../src/config/env.js';

class MockProvider implements MedicalSummaryProvider {
  constructor(
    public readonly name: 'gemini' | 'deepseek',
    public readonly modelName: string,
    private configured = true,
    public shouldFail = false,
    public failureError: Error = new Error('Provider network failure')
  ) {}

  isConfigured(): boolean {
    return this.configured;
  }

  async analyze(task: ProviderAnalyzeTask): Promise<ProviderExecutionResult> {
    if (this.shouldFail) {
      throw this.failureError;
    }
    return {
      provider: this.name,
      model: this.modelName,
      latencyMs: 350,
      result: MOCK_STRUCTURED_RESULT,
    };
  }
}

describe('OrchestratorService', () => {
  let mockGemini: MockProvider;
  let mockDeepSeek: MockProvider;
  let orchestrator: OrchestratorService;

  beforeEach(() => {
    mockGemini = new MockProvider('gemini', 'gemini-3.8-flash');
    mockDeepSeek = new MockProvider('deepseek', 'deepseek-v4-flash');
    orchestrator = new OrchestratorService(mockGemini, mockDeepSeek);
  });

  it('routes to Gemini when provider is gemini', async () => {
    const response = await orchestrator.analyze(
      {
        recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
        provider: 'gemini',
        audience: 'both',
        language: 'id',
      },
      'test-req-1'
    );

    expect(response.requestedProvider).toBe('gemini');
    expect(response.actualProvider).toBe('gemini');
    expect(response.fallbackApplied).toBe(false);
    expect(response.validatedResult).toEqual(MOCK_STRUCTURED_RESULT);
    expect(response.completedResults.length).toBe(1);
    expect(response.completedResults[0].provider).toBe('gemini');
  });

  it('routes to DeepSeek when provider is deepseek', async () => {
    const response = await orchestrator.analyze(
      {
        recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
        provider: 'deepseek',
        audience: 'both',
        language: 'id',
      },
      'test-req-2'
    );

    expect(response.requestedProvider).toBe('deepseek');
    expect(response.actualProvider).toBe('deepseek');
    expect(response.fallbackApplied).toBe(false);
    expect(response.completedResults[0].provider).toBe('deepseek');
  });

  it('throws error if provider fails and ALLOW_PROVIDER_FALLBACK is false', async () => {
    mockGemini.shouldFail = true;
    env.ALLOW_PROVIDER_FALLBACK = false;

    await expect(
      orchestrator.analyze(
        {
          recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
          provider: 'gemini',
          audience: 'both',
          language: 'id',
        },
        'test-req-3'
      )
    ).rejects.toThrow('Penyedia AI GEMINI gagal memproses');
  });

  it('performs explicit fallback to alternate provider when ALLOW_PROVIDER_FALLBACK is true', async () => {
    mockGemini.shouldFail = true;
    env.ALLOW_PROVIDER_FALLBACK = true;

    const response = await orchestrator.analyze(
      {
        recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
        provider: 'gemini',
        audience: 'both',
        language: 'id',
      },
      'test-req-4'
    );

    expect(response.requestedProvider).toBe('gemini');
    expect(response.actualProvider).toBe('deepseek');
    expect(response.fallbackApplied).toBe(true);
    expect(response.fallbackReason).toContain('Penyedia gemini mengalami kegagalan');
    expect(response.fallbackReason).toContain('Otomatis dialihkan ke deepseek');
    expect(response.validatedResult).toBeDefined();

    // Reset env
    env.ALLOW_PROVIDER_FALLBACK = false;
  });

  it('executes both in compare mode and returns side-by-side results', async () => {
    const response = await orchestrator.analyze(
      {
        recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
        provider: 'compare',
        audience: 'both',
        language: 'id',
      },
      'test-req-5'
    );

    expect(response.requestedProvider).toBe('compare');
    expect(response.completedResults.length).toBe(2);
    expect(response.completedResults[0].provider).toBe('gemini');
    expect(response.completedResults[0].result).toBeDefined();
    expect(response.completedResults[1].provider).toBe('deepseek');
    expect(response.completedResults[1].result).toBeDefined();
  });

  it('handles compare mode partial success if one provider fails', async () => {
    mockGemini.shouldFail = true; // Gemini fails, DeepSeek succeeds

    const response = await orchestrator.analyze(
      {
        recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
        provider: 'compare',
        audience: 'both',
        language: 'id',
      },
      'test-req-6'
    );

    expect(response.requestedProvider).toBe('compare');
    expect(response.completedResults.length).toBe(2);

    const geminiItem = response.completedResults.find((r) => r.provider === 'gemini');
    const deepseekItem = response.completedResults.find((r) => r.provider === 'deepseek');

    expect(geminiItem?.result).toBeNull();
    expect(geminiItem?.error).toBeDefined();

    expect(deepseekItem?.result).toBeDefined();
    expect(deepseekItem?.error).toBeNull();

    // Validated result falls back to the working provider without crashing
    expect(response.validatedResult).toEqual(MOCK_STRUCTURED_RESULT);
  });

  it('throws when both providers fail in compare mode', async () => {
    mockGemini.shouldFail = true;
    mockDeepSeek.shouldFail = true;

    await expect(
      orchestrator.analyze(
        {
          recordText: 'Pasien kontrol hipertensi dengan amlodipine 10mg.',
          provider: 'compare',
          audience: 'both',
          language: 'id',
        },
        'test-req-7'
      )
    ).rejects.toThrow('Kedua penyedia AI (Gemini & DeepSeek) gagal memproses');
  });
});
