/**
 * Opt-In Manual Integration Test Script for Live AI Providers.
 * Run only when real API keys are configured and manual validation is desired.
 *
 * Usage:
 *   npx tsx scripts/manual-provider-test.ts [gemini|deepseek|all]
 */

import { GeminiProvider } from '../src/services/providers/gemini.provider.js';
import { DeepSeekProvider } from '../src/services/providers/deepseek.provider.js';
import { DEFAULT_SYNTHETIC_SAMPLE } from '@medibrief/shared';

const target = process.argv[2] || 'all';

async function testGemini() {
  console.log('\n--- [MANUAL TEST] Testing Live Google Gemini Provider ---');
  const provider = new GeminiProvider();

  if (!provider.isConfigured()) {
    console.log('⚠️ GEMINI_API_KEY tidak dikonfigurasi pada .env. Melewati pengujian.');
    return;
  }

  console.log(`Mengirim permintaan analisis rekam medis ke model: ${provider.modelName}...`);
  const start = Date.now();
  try {
    const outcome = await provider.analyze({
      recordText: DEFAULT_SYNTHETIC_SAMPLE,
      audience: 'both',
      language: 'id',
    });

    console.log(`✅ Sukses! Latensi: ${outcome.latencyMs}ms`);
    console.log(`- Keluhan utama: ${outcome.result.clinicalSummary.chiefComplaint}`);
    console.log(`- Assessment: ${outcome.result.clinicalSummary.assessmentFromSource}`);
    console.log(`- Missing info: ${outcome.result.missingInformation.length} item`);
    console.log(`- Safety notes: ${outcome.result.safetyNotes.length} item`);
  } catch (err) {
    console.error('❌ Gagal pengujian Gemini:', err);
  }
}

async function testDeepSeek() {
  console.log('\n--- [MANUAL TEST] Testing Live DeepSeek Provider ---');
  const provider = new DeepSeekProvider();

  if (!provider.isConfigured()) {
    console.log('⚠️ DEEPSEEK_API_KEY tidak dikonfigurasi pada .env. Melewati pengujian.');
    return;
  }

  console.log(`Mengirim permintaan analisis rekam medis ke model: ${provider.modelName}...`);
  try {
    const outcome = await provider.analyze({
      recordText: DEFAULT_SYNTHETIC_SAMPLE,
      audience: 'both',
      language: 'id',
    });

    console.log(`✅ Sukses! Latensi: ${outcome.latencyMs}ms`);
    console.log(`- Keluhan utama: ${outcome.result.clinicalSummary.chiefComplaint}`);
    console.log(`- Assessment: ${outcome.result.clinicalSummary.assessmentFromSource}`);
    console.log(`- Missing info: ${outcome.result.missingInformation.length} item`);
  } catch (err) {
    console.error('❌ Gagal pengujian DeepSeek:', err);
  }
}

async function main() {
  console.log('🩺 MediBrief - Pengujian Integrasi Manual Provider AI');

  if (target === 'gemini' || target === 'all') {
    await testGemini();
  }

  if (target === 'deepseek' || target === 'all') {
    await testDeepSeek();
  }

  console.log('\nPengujian manual selesai.\n');
}

main().catch(console.error);
