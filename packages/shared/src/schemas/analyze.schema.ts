import { z } from 'zod';

export const ProviderOptionSchema = z.enum(['gemini', 'deepseek', 'compare']);
export type ProviderOption = z.infer<typeof ProviderOptionSchema>;

export const SingleProviderSchema = z.enum(['gemini', 'deepseek']);
export type SingleProvider = z.infer<typeof SingleProviderSchema>;

export const AudienceOptionSchema = z.enum(['clinical', 'patient', 'both']);
export type AudienceOption = z.infer<typeof AudienceOptionSchema>;

export const LanguageOptionSchema = z.enum(['id', 'en']);
export type LanguageOption = z.infer<typeof LanguageOptionSchema>;

/**
 * Request payload validation schema for POST /api/v1/medical-records/analyze
 */
export const RecordAnalyzeRequestSchema = z.object({
  recordText: z
    .string()
    .min(20, 'Teks rekam medis minimal 20 karakter.')
    .max(20000, 'Teks rekam medis maksimal 20.000 karakter.')
    .refine((val) => val.trim().length >= 20, {
      message: 'Teks rekam medis tidak boleh hanya berupa spasi kosong.',
    }),
  provider: ProviderOptionSchema.default('gemini'),
  audience: AudienceOptionSchema.default('both'),
  language: LanguageOptionSchema.default('id'),
});
export type RecordAnalyzeRequest = z.infer<typeof RecordAnalyzeRequestSchema>;

/**
 * Structured Clinical Summary Schema
 */
export const ClinicalSummarySchema = z.object({
  chiefComplaint: z.string().describe('Keluhan utama yang tercantum dalam rekam medis'),
  relevantHistory: z.string().describe('Riwayat penyakit sekarang dan terdahulu yang relevan'),
  medications: z.string().describe('Obat-obatan yang sedang atau pernah dikonsumsi pasien sesuai rekam medis'),
  allergies: z.string().describe('Riwayat alergi obat atau makanan yang tercatat'),
  examinationFindings: z.string().describe('Hasil pemeriksaan fisik dan tanda vital'),
  laboratoryFindings: z.string().describe('Hasil pemeriksaan penunjang/laboratorium/radiologi'),
  assessmentFromSource: z.string().describe('Diagnosis atau assessment yang secara eksplisit ditulis oleh klinisi pada rekam medis'),
  planFromSource: z.string().describe('Rencana penanganan atau terapi yang secara eksplisit tertulis dalam rekam medis'),
  followUpFromSource: z.string().describe('Rencana tindak lanjut atau kontrol ulang yang tertulis'),
});
export type ClinicalSummary = z.infer<typeof ClinicalSummarySchema>;

/**
 * Patient-friendly Explanation Schema
 */
export const PatientExplanationSchema = z.object({
  overview: z.string().describe('Penjelasan kondisi umum dalam bahasa awam yang mudah dipahami dan menenangkan'),
  medicinesMentioned: z.string().describe('Rangkuman obat-obatan yang disebutkan dan petunjuk minum yang tertulis'),
  followUp: z.string().describe('Langkah berikutnya yang perlu dilakukan pasien sesuai anjuran dokter'),
  questionsForHealthcareProfessional: z
    .array(z.string())
    .describe('Daftar pertanyaan yang disarankan untuk ditanyakan pasien saat berkonsultasi kembali dengan dokter'),
});
export type PatientExplanation = z.infer<typeof PatientExplanationSchema>;

/**
 * Complete Structured Analysis Result Schema produced by AI Providers
 */
export const StructuredAnalysisResultSchema = z.object({
  clinicalSummary: ClinicalSummarySchema,
  patientExplanation: PatientExplanationSchema,
  missingInformation: z
    .array(z.string())
    .describe('Daftar informasi penting yang tidak ditemukan atau tidak disebutkan dalam rekam medis'),
  conflictingInformation: z
    .array(z.string())
    .describe('Daftar ketidakkonsistenan atau kontradiksi yang ditemukan dalam isi catatan'),
  uncertainties: z
    .array(z.string())
    .describe('Hal-hal yang meragukan atau membutuhkan klarifikasi dokter pemeriksa'),
  safetyNotes: z
    .array(z.string())
    .describe('Catatan peringatan keselamatan spesifik berdasarkan isi rekam medis'),
});
export type StructuredAnalysisResult = z.infer<typeof StructuredAnalysisResultSchema>;

/**
 * Individual provider outcome in execution
 */
export const ProviderResultItemSchema = z.object({
  provider: SingleProviderSchema,
  model: z.string(),
  latencyMs: z.number().int().nonnegative(),
  result: StructuredAnalysisResultSchema.nullable(),
  error: z.string().nullable().optional(),
});
export type ProviderResultItem = z.infer<typeof ProviderResultItemSchema>;

/**
 * Standard Envelope returned by POST /api/v1/medical-records/analyze
 */
export const RecordAnalyzeResponseSchema = z.object({
  requestId: z.string().uuid(),
  requestedProvider: ProviderOptionSchema,
  actualProvider: z.string(),
  actualModel: z.string(),
  completedResults: z.array(ProviderResultItemSchema),
  fallbackApplied: z.boolean(),
  fallbackReason: z.string().nullable(),
  latencyMs: z.number().int().nonnegative(),
  safetyDisclaimer: z.string(),
  validatedResult: StructuredAnalysisResultSchema.nullable(),
});
export type RecordAnalyzeResponse = z.infer<typeof RecordAnalyzeResponseSchema>;

/**
 * Provider status schema for GET /api/v1/providers
 */
export const ProviderStatusItemSchema = z.object({
  id: SingleProviderSchema,
  name: z.string(),
  model: z.string(),
  configured: z.boolean(),
  isDefault: z.boolean(),
});
export type ProviderStatusItem = z.infer<typeof ProviderStatusItemSchema>;

export const ProvidersStatusResponseSchema = z.object({
  providers: z.array(ProviderStatusItemSchema),
  supportsCompare: z.boolean(),
  fallbackAllowed: z.boolean(),
});
export type ProvidersStatusResponse = z.infer<typeof ProvidersStatusResponseSchema>;
