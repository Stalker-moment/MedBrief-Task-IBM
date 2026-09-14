import {
  getDisclaimer,
  ProviderOption,
  ProviderResultItem,
  RecordAnalyzeRequest,
  RecordAnalyzeResponse,
  SingleProvider,
  StructuredAnalysisResult,
} from '@medibrief/shared';
import { env } from '../config/env.js';
import { SafeLogger } from '../middleware/logger.js';
import { AppError } from '../middleware/error-handler.js';
import { DeepSeekProvider } from './providers/deepseek.provider.js';
import { GeminiProvider } from './providers/gemini.provider.js';
import { MedicalSummaryProvider, ProviderAnalyzeTask, ProviderExecutionResult } from './providers/types.js';

export class OrchestratorService {
  private geminiProvider: MedicalSummaryProvider;
  private deepseekProvider: MedicalSummaryProvider;

  constructor(
    gemini?: MedicalSummaryProvider,
    deepseek?: MedicalSummaryProvider
  ) {
    this.geminiProvider = gemini || new GeminiProvider();
    this.deepseekProvider = deepseek || new DeepSeekProvider();
  }

  getProvider(providerName: SingleProvider): MedicalSummaryProvider {
    return providerName === 'gemini' ? this.geminiProvider : this.deepseekProvider;
  }

  getAlternateProviderName(providerName: SingleProvider): SingleProvider {
    return providerName === 'gemini' ? 'deepseek' : 'gemini';
  }

  getProvidersStatus() {
    return [
      {
        id: 'gemini' as SingleProvider,
        name: 'Google Gemini',
        model: this.geminiProvider.modelName,
        configured: this.geminiProvider.isConfigured(),
        isDefault: true,
      },
      {
        id: 'deepseek' as SingleProvider,
        name: 'DeepSeek',
        model: this.deepseekProvider.modelName,
        configured: this.deepseekProvider.isConfigured(),
        isDefault: false,
      },
    ];
  }

  /**
   * Executes a provider call with timeout and at most one retry for 429/5xx errors.
   */
  private async executeWithTimeoutAndRetry(
    provider: MedicalSummaryProvider,
    task: ProviderAnalyzeTask
  ): Promise<ProviderExecutionResult> {
    const timeoutMs = env.AI_TIMEOUT_MS || 30000;

    const executeOnce = async (): Promise<ProviderExecutionResult> => {
      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort(new Error(`Batas waktu pemrosesan AI terlampaui (${timeoutMs}ms)`));
      }, timeoutMs);

      try {
        const result = await provider.analyze({
          ...task,
          signal: controller.signal,
        });
        clearTimeout(timer);
        return result;
      } catch (err) {
        clearTimeout(timer);
        throw err;
      }
    };

    try {
      return await executeOnce();
    } catch (firstError: unknown) {
      const isRetryable = this.isRetryableError(firstError);
      if (!isRetryable) {
        throw firstError;
      }

      SafeLogger.warn(`Provider ${provider.name} encountered retryable error. Performing 1 conservative retry...`, {
        provider: provider.name,
        error: firstError instanceof Error ? firstError.message : String(firstError),
      });

      // Brief backoff before retry (500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await executeOnce();
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const msg = error instanceof Error ? error.message : '';
    const status = (error as { status?: number; statusCode?: number }).status ||
      (error as { status?: number; statusCode?: number }).statusCode;

    if (status === 429 || (status !== undefined && status >= 500 && status < 600)) {
      return true;
    }

    if (
      msg.includes('429') ||
      msg.includes('rate limit') ||
      msg.includes('quota') ||
      msg.includes('RESOURCE_EXHAUSTED') ||
      msg.includes('503') ||
      msg.includes('500') ||
      msg.includes('overloaded')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Main orchestrator dispatch method.
   */
  async analyze(request: RecordAnalyzeRequest, requestId: string): Promise<RecordAnalyzeResponse> {
    const overallStartTime = Date.now();
    const task: ProviderAnalyzeTask = {
      recordText: request.recordText,
      audience: request.audience,
      language: request.language,
    };

    // Mode 1: COMPARE Mode (Promise.allSettled)
    if (request.provider === 'compare') {
      return this.handleCompareMode(task, requestId, overallStartTime);
    }

    // Mode 2: SINGLE Provider Mode with optional explicit fallback
    return this.handleSingleProviderMode(
      request.provider,
      task,
      requestId,
      overallStartTime
    );
  }

  private async handleCompareMode(
    task: ProviderAnalyzeTask,
    requestId: string,
    overallStartTime: number
  ): Promise<RecordAnalyzeResponse> {
    const [geminiResult, deepseekResult] = await Promise.allSettled([
      this.executeWithTimeoutAndRetry(this.geminiProvider, task),
      this.executeWithTimeoutAndRetry(this.deepseekProvider, task),
    ]);

    const completedResults: ProviderResultItem[] = [];

    if (geminiResult.status === 'fulfilled') {
      completedResults.push({
        provider: 'gemini',
        model: geminiResult.value.model,
        latencyMs: geminiResult.value.latencyMs,
        result: geminiResult.value.result,
        error: null,
      });
    } else {
      const errMsg = geminiResult.reason instanceof Error ? geminiResult.reason.message : 'Unknown error';
      completedResults.push({
        provider: 'gemini',
        model: this.geminiProvider.modelName,
        latencyMs: 0,
        result: null,
        error: errMsg,
      });
    }

    if (deepseekResult.status === 'fulfilled') {
      completedResults.push({
        provider: 'deepseek',
        model: deepseekResult.value.model,
        latencyMs: deepseekResult.value.latencyMs,
        result: deepseekResult.value.result,
        error: null,
      });
    } else {
      const errMsg = deepseekResult.reason instanceof Error ? deepseekResult.reason.message : 'Unknown error';
      completedResults.push({
        provider: 'deepseek',
        model: this.deepseekProvider.modelName,
        latencyMs: 0,
        result: null,
        error: errMsg,
      });
    }

    // If both failed, throw error
    const anySucceeded = completedResults.some((r) => r.result !== null);
    if (!anySucceeded) {
      throw new AppError(
        502,
        'ALL_PROVIDERS_FAILED',
        'Kedua penyedia AI (Gemini & DeepSeek) gagal memproses catatan medis. Periksa konfigurasi kunci API dan koneksi jaringan.'
      );
    }

    // Use the first successful result as the primary validatedResult
    const primaryResult = completedResults.find((r) => r.result !== null);

    return {
      requestId,
      requestedProvider: 'compare',
      actualProvider: 'compare (Gemini & DeepSeek)',
      actualModel: `${this.geminiProvider.modelName} & ${this.deepseekProvider.modelName}`,
      completedResults,
      fallbackApplied: false,
      fallbackReason: null,
      latencyMs: Date.now() - overallStartTime,
      safetyDisclaimer: getDisclaimer(task.language),
      validatedResult: primaryResult?.result ?? null,
    };
  }

  private async handleSingleProviderMode(
    requestedProvider: SingleProvider,
    task: ProviderAnalyzeTask,
    requestId: string,
    overallStartTime: number
  ): Promise<RecordAnalyzeResponse> {
    const primaryProvider = this.getProvider(requestedProvider);
    let fallbackApplied = false;
    let fallbackReason: string | null = null;
    let finalExecution: ProviderExecutionResult | null = null;

    try {
      finalExecution = await this.executeWithTimeoutAndRetry(primaryProvider, task);
    } catch (primaryError) {
      const primaryErrMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);

      SafeLogger.warn(`Primary provider ${requestedProvider} failed`, {
        requestId,
        provider: requestedProvider,
        error: primaryErrMsg,
      });

      // Check if fallback is allowed
      if (!env.ALLOW_PROVIDER_FALLBACK) {
        throw new AppError(
          502,
          'AI_PROVIDER_ERROR',
          `Penyedia AI ${requestedProvider.toUpperCase()} gagal memproses: ${primaryErrMsg}`
        );
      }

      // Attempt fallback to alternate provider
      const alternateName = this.getAlternateProviderName(requestedProvider);
      const alternateProvider = this.getProvider(alternateName);

      SafeLogger.info(`Initiating fallback from ${requestedProvider} to ${alternateName}...`, {
        requestId,
        requestedProvider,
        fallbackProvider: alternateName,
      });

      try {
        finalExecution = await this.executeWithTimeoutAndRetry(alternateProvider, task);
        fallbackApplied = true;
        fallbackReason = `Penyedia ${requestedProvider} mengalami kegagalan (${primaryErrMsg}). Otomatis dialihkan ke ${alternateName}.`;
      } catch (fallbackError) {
        const fallbackErrMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        throw new AppError(
          502,
          'AI_FALLBACK_FAILED',
          `Penyedia utama (${requestedProvider}) dan cadangan (${alternateName}) keduanya gagal: ${fallbackErrMsg}`
        );
      }
    }

    const completedResults: ProviderResultItem[] = [
      {
        provider: finalExecution.provider,
        model: finalExecution.model,
        latencyMs: finalExecution.latencyMs,
        result: finalExecution.result,
      },
    ];

    return {
      requestId,
      requestedProvider,
      actualProvider: finalExecution.provider,
      actualModel: finalExecution.model,
      completedResults,
      fallbackApplied,
      fallbackReason,
      latencyMs: Date.now() - overallStartTime,
      safetyDisclaimer: getDisclaimer(task.language),
      validatedResult: finalExecution.result,
    };
  }
}
