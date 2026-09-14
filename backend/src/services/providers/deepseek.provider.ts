import OpenAI from 'openai';
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

export class DeepSeekProvider implements MedicalSummaryProvider {
  public readonly name: SingleProvider = 'deepseek';
  public readonly modelName: string;
  private readonly apiKey: string;
  private client: OpenAI | null = null;

  constructor(apiKey?: string, modelName?: string) {
    this.apiKey = apiKey || env.DEEPSEEK_API_KEY;
    this.modelName = modelName || env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: 'https://api.deepseek.com',
      });
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
      throw new Error('DeepSeek API key belum dikonfigurasi pada server (DEEPSEEK_API_KEY kosong).');
    }

    const startTime = Date.now();
    const { systemPrompt, userPrompt } = PromptBuilder.buildPrompt({
      recordText: task.recordText,
      audience: task.audience,
      language: task.language,
    });

    const callModel = async (sysPrompt: string, usrPrompt: string): Promise<string> => {
      const completion = await this.client!.chat.completions.create(
        {
          model: this.modelName,
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: usrPrompt },
          ],
          response_format: { type: 'json_object' },
        },
        { signal: task.signal }
      );

      return completion.choices[0]?.message?.content || '';
    };

    let rawText = '';
    try {
      rawText = await callModel(systemPrompt, userPrompt);
    } catch (error: unknown) {
      SafeLogger.error('DeepSeek completion error', error, {
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
    SafeLogger.warn('DeepSeek initial response failed schema validation. Attempting schema repair...', {
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
        SafeLogger.info('DeepSeek schema repair succeeded.', {
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
      SafeLogger.error('DeepSeek schema repair failed completely', repairError, {
        provider: this.name,
        model: this.modelName,
      });
      throw new Error('Respons model DeepSeek tidak sesuai dengan format skema rekam medis yang diwajibkan.');
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
