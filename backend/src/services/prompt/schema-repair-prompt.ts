import { LanguageOption } from '@medibrief/shared';

export interface SchemaRepairParams {
  rawOutput: string;
  validationError: string;
  language: LanguageOption;
}

/**
 * Builds a schema repair prompt when model output fails Zod parsing.
 * Crucially, does NOT include any sensitive secrets or instructions outside the schema requirement.
 */
export function buildSchemaRepairPrompt(params: SchemaRepairParams): {
  systemPrompt: string;
  userPrompt: string;
} {
  const { rawOutput, validationError, language } = params;

  const systemPrompt =
    language === 'en'
      ? `You are a JSON schema repair utility for MediBrief.
Your task is to fix the malformed JSON output so that it satisfies the required JSON schema.
RULES:
1. Do NOT invent or add any new clinical information.
2. Return ONLY a valid JSON object matching the required schema.
3. If a field was missing in the original output, set it to "Not mentioned".
4. Do NOT output markdown code blocks or explanations outside the JSON.`
      : `Anda adalah modul perbaikan skema JSON untuk MediBrief.
Tugas Anda adalah memperbaiki output JSON yang tidak valid agar sesuai dengan skema yang diwajibkan.
ATURAN:
1. JANGAN PERNAH mengarang atau menambahkan informasi klinis baru.
2. Kembalikan HANYA objek JSON valid yang memenuhi skema.
3. Jika ada kolom yang terlewat, isi nilainya dengan "Tidak disebutkan".
4. JANGAN gunakan tanda markdown atau penjelasan di luar JSON.`;

  // Safely truncate raw output if excessively large
  const truncatedRaw = rawOutput.length > 5000 ? rawOutput.slice(0, 5000) + '...[truncated]' : rawOutput;

  const userPrompt =
    language === 'en'
      ? `The previous response failed schema validation.
Validation error: ${validationError}

Original invalid text:
${truncatedRaw}

Please correct the format and output ONLY the valid JSON object.`
      : `Output sebelumnya gagal pada validasi skema.
Error validasi: ${validationError}

Teks awal yang tidak valid:
${truncatedRaw}

Silakan perbaiki formatnya dan keluarkan HANYA objek JSON yang valid.`;

  return { systemPrompt, userPrompt };
}
