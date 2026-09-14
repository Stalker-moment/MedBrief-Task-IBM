import { GoogleGenAI } from '@google/genai';
import {
  SingleProvider,
  StructuredAnalysisResult,
  StructuredAnalysisResultSchema,
} from '@medibrief/shared';
import { env } from '../../config/env.js';
import { SafeLogger } from '../../middleware/logger.js';
import { PromptBuilder } from '../prompt/prompt-builder.js';
import { buildSchemaRepairPrompt } from '../prompt/schema-repair-prompt.js';
import { MedicalSummaryProvider, ProviderAnalyzeTask, ProviderExecutionResult } from './types.js';

export class GeminiProvider implements MedicalSummaryProvider {
  public readonly name: SingleProvider = 'gemini';
  public readonly modelName: string;
  private readonly apiKey: string;
  private client: GoogleGenAI | null = null;

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || env.GEMINI_API_KEY;
    this.modelName = modelName || env.GEMINI_MODEL || 'gemini-3.8-flash';

    if (this.apiKey) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private cleanJsonString(rawText: string): string {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.slice(7);
    } else if (clean.startsWith('```')) {
      clean = clean.slice(3);
    }
    if (clean.endsWith('```')) {
      clean = clean.slice(0, -3);
    }
    return clean.trim();
  }

  async analyze(task: ProviderAnalyzeTask): Promise<ProviderExecutionResult> {
    if (!this.client) {
      throw new Error('Gemini API key belum dikonfigurasi pada server (GEMINI_API_KEY kosong).');
    }

    const startTime = Date.now();
    const { systemPrompt, userPrompt } = PromptBuilder.buildPrompt({
      recordText: task.recordText,
      audience: task.audience,
      language: task.language,
    });

    const callModel = async (sysPrompt: string, usrPrompt: string): Promise<string> => {
      const response = await this.client!.models.generateContent({
        model: this.modelName,
        contents: usrPrompt,
        config: {
          systemInstruction: sysPrompt,
          responseMimeType: 'application/json',
        },
      });

      return response.text || '';
    };

    let rawText = '';
    try {
      rawText = await callModel(systemPrompt, userPrompt);
    } catch (error: unknown) {
      SafeLogger.error('Gemini generateContent error', error, {
        provider: this.name,
        model: this.modelName,
      });
      throw error;
    }

    // Attempt 1: Parse and validate JSON
    const parsedResult = this.tryParseAndValidate(rawText);
    if (parsedResult.success) {
      return {
        provider: this.name,
        model: this.modelName,
        latencyMs: Date.now() - startTime,
        result: parsedResult.data,
      };
    }

    // Attempt 2: Schema Repair (at most 1 retry)
    SafeLogger.warn('Gemini initial response failed schema validation. Attempting schema repair...', {
      provider: this.name,
      model: this.modelName,
      validationError: parsedResult.error,
    });

    const repairPrompts = buildSchemaRepairPrompt({
      rawOutput: rawText,
      validationError: parsedResult.error,
      language: task.language,
    });

    try {
      const repairedRaw = await callModel(repairPrompts.systemPrompt, repairPrompts.userPrompt);
      const repairedResult = this.tryParseAndValidate(repairedRaw);

      if (repairedResult.success) {
        SafeLogger.info('Gemini schema repair succeeded.', {
          provider: this.name,
          model: this.modelName,
        });
        return {
          provider: this.name,
          model: this.modelName,
          latencyMs: Date.now() - startTime,
          result: repairedResult.data,
        };
      }

      throw new Error(`Validasi skema tetap gagal setelah perbaikan: ${repairedResult.error}`);
    } catch (repairError) {
      SafeLogger.error('Gemini schema repair failed completely', repairError, {
        provider: this.name,
        model: this.modelName,
      });
      throw new Error('Respons model Gemini tidak sesuai dengan format skema rekam medis yang diwajibkan.');
    }
  }

  private tryParseAndValidate(
    rawText: string
  ): { success: true; data: StructuredAnalysisResult } | { success: false; error: string } {
    try {
      const cleanJson = this.cleanJsonString(rawText);
      const parsedObj = JSON.parse(cleanJson);
      const validation = StructuredAnalysisResultSchema.safeParse(parsedObj);

      if (validation.success) {
        return { success: true, data: validation.data };
      }
      return {
        success: false,
        error: validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Invalid JSON syntax',
      };
    }
  }
}
