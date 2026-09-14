import { describe, it, expect } from 'vitest';
import {
  RecordAnalyzeRequestSchema,
  StructuredAnalysisResultSchema,
  RecordAnalyzeResponseSchema,
} from '@medibrief/shared';
import { MOCK_STRUCTURED_RESULT } from './fixtures.js';

describe('Zod Schemas Validation', () => {
  describe('RecordAnalyzeRequestSchema', () => {
    it('accepts valid input within 20-20000 characters', () => {
      const valid = {
        recordText: 'Pasien datang dengan keluhan batuk pilek sejak 3 hari.',
        provider: 'gemini',
        audience: 'both',
        language: 'id',
      };
      const parsed = RecordAnalyzeRequestSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects input shorter than 20 characters', () => {
      const tooShort = {
        recordText: 'Batuk pilek.',
        provider: 'gemini',
        audience: 'both',
        language: 'id',
      };
      const parsed = RecordAnalyzeRequestSchema.safeParse(tooShort);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.errors[0]?.message).toContain('minimal 20 karakter');
      }
    });

    it('rejects input composed only of whitespace', () => {
      const onlySpaces = {
        recordText: '                             ',
        provider: 'gemini',
        audience: 'both',
        language: 'id',
      };
      const parsed = RecordAnalyzeRequestSchema.safeParse(onlySpaces);
      expect(parsed.success).toBe(false);
    });

    it('rejects input exceeding 20,000 characters', () => {
      const tooLong = {
        recordText: 'A'.repeat(20001),
        provider: 'gemini',
      };
      const parsed = RecordAnalyzeRequestSchema.safeParse(tooLong);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.errors[0]?.message).toContain('maksimal 20.000 karakter');
      }
    });

    it('defaults provider, audience, and language if omitted', () => {
      const minimal = {
        recordText: 'Pasien kontrol rutin hipertensi dengan obat rutin amlodipine.',
      };
      const parsed = RecordAnalyzeRequestSchema.parse(minimal);
      expect(parsed.provider).toBe('gemini');
      expect(parsed.audience).toBe('both');
      expect(parsed.language).toBe('id');
    });

    it('rejects invalid enum values', () => {
      const invalidEnum = {
        recordText: 'Pasien kontrol rutin hipertensi dengan obat rutin amlodipine.',
        provider: 'invalid-ai',
      };
      const parsed = RecordAnalyzeRequestSchema.safeParse(invalidEnum);
      expect(parsed.success).toBe(false);
    });
  });

  describe('StructuredAnalysisResultSchema', () => {
    it('validates a complete clinical summary and explanation', () => {
      const parsed = StructuredAnalysisResultSchema.safeParse(MOCK_STRUCTURED_RESULT);
      expect(parsed.success).toBe(true);
    });

    it('fails if required fields are missing from clinicalSummary', () => {
      const incomplete = {
        ...MOCK_STRUCTURED_RESULT,
        clinicalSummary: {
          chiefComplaint: 'Batuk',
          // missing all other mandatory fields
        },
      };
      const parsed = StructuredAnalysisResultSchema.safeParse(incomplete);
      expect(parsed.success).toBe(false);
    });
  });

  describe('RecordAnalyzeResponseSchema', () => {
    it('validates a complete response envelope', () => {
      const envelope = {
        requestId: '8a9c3d4e-1234-4567-89ab-cdef01234567',
        requestedProvider: 'gemini',
        actualProvider: 'gemini',
        actualModel: 'gemini-3.8-flash',
        completedResults: [
          {
            provider: 'gemini',
            model: 'gemini-3.8-flash',
            latencyMs: 1250,
            result: MOCK_STRUCTURED_RESULT,
          },
        ],
        fallbackApplied: false,
        fallbackReason: null,
        latencyMs: 1250,
        safetyDisclaimer: 'PERINGATAN PENTING: Bukan pengganti dokter.',
        validatedResult: MOCK_STRUCTURED_RESULT,
      };

      const parsed = RecordAnalyzeResponseSchema.safeParse(envelope);
      expect(parsed.success).toBe(true);
    });
  });
});
