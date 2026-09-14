import { describe, it, expect } from 'vitest';
import { PromptBuilder } from '../src/services/prompt/prompt-builder.js';
import {
  wrapInRecordDelimiters,
  MEDICAL_RECORD_START_TAG,
  MEDICAL_RECORD_END_TAG,
} from '@medibrief/shared';

describe('Prompt Layering Engine', () => {
  const sampleNote = 'Pasien mengeluh pusing dan demam sejak kemarin. TD 130/80.';

  it('generates both system prompt and user prompt', () => {
    const { systemPrompt, userPrompt } = PromptBuilder.buildPrompt({
      recordText: sampleNote,
      audience: 'both',
      language: 'id',
    });

    expect(systemPrompt).toBeDefined();
    expect(userPrompt).toBeDefined();
  });

  it('contains all 8 required prompt layers in system prompt', () => {
    const { systemPrompt } = PromptBuilder.buildPrompt({
      recordText: sampleNote,
      audience: 'both',
      language: 'id',
    });

    // Layer 1
    expect(systemPrompt).toContain('LAYER 1: PERAN & TUJUAN');
    expect(systemPrompt).toContain('asisten dokumentasi');

    // Layer 2
    expect(systemPrompt).toContain('LAYER 2: BATASAN KEAMANAN & PRIVASI');
    expect(systemPrompt).toContain('JANGAN PERNAH mengarang');

    // Layer 3
    expect(systemPrompt).toContain('LAYER 3: PENETAPAN SUMBER DATA');
    expect(systemPrompt).toContain('Tidak disebutkan');

    // Layer 4
    expect(systemPrompt).toContain('LAYER 4: PERTAHANAN PROMPT-INJECTION');
    expect(systemPrompt).toContain(MEDICAL_RECORD_START_TAG);
    expect(systemPrompt).toContain(MEDICAL_RECORD_END_TAG);

    // Layer 5
    expect(systemPrompt).toContain('LAYER 5: TUGAS EKSTRAKSI & STRUKTURASI');
    expect(systemPrompt).toContain('clinicalSummary');
    expect(systemPrompt).toContain('patientExplanation');

    // Layer 6
    expect(systemPrompt).toContain('LAYER 6: AUDIENCE & LANGUAGE TRANSFORMATION');

    // Layer 7
    expect(systemPrompt).toContain('LAYER 7: STRICT JSON OUTPUT CONTRACT');
    expect(systemPrompt).toContain('"chiefComplaint"');

    // Layer 8
    expect(systemPrompt).toContain('LAYER 8: PEMERIKSAAN AKHIR');
  });

  it('wraps the medical record inside secure delimiters in user prompt', () => {
    const { userPrompt } = PromptBuilder.buildPrompt({
      recordText: sampleNote,
      audience: 'clinical',
      language: 'en',
    });

    expect(userPrompt).toContain(MEDICAL_RECORD_START_TAG);
    expect(userPrompt).toContain(MEDICAL_RECORD_END_TAG);
    expect(userPrompt).toContain(sampleNote);
  });

  it('adapts language correctly between Indonesian and English', () => {
    const idPrompt = PromptBuilder.buildPrompt({
      recordText: sampleNote,
      audience: 'both',
      language: 'id',
    });
    expect(idPrompt.systemPrompt).toContain('Bahasa Indonesia');
    expect(idPrompt.systemPrompt).toContain('Tidak disebutkan');

    const enPrompt = PromptBuilder.buildPrompt({
      recordText: sampleNote,
      audience: 'both',
      language: 'en',
    });
    expect(enPrompt.systemPrompt).toContain('English');
    expect(enPrompt.systemPrompt).toContain('Not mentioned');
  });
});
