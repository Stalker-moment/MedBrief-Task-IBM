import {
  AudienceOption,
  LanguageOption,
  SingleProvider,
  StructuredAnalysisResult,
} from '@medibrief/shared';

export interface ProviderAnalyzeTask {
  recordText: string;
  audience: AudienceOption;
  language: LanguageOption;
  signal?: AbortSignal;
}

export interface ProviderExecutionResult {
  provider: SingleProvider;
  model: string;
  latencyMs: number;
  result: StructuredAnalysisResult;
}

/**
 * Provider-neutral interface for AI medical summary engines.
 * Vendor-specific response types must NEVER be leaked through this interface.
 */
export interface MedicalSummaryProvider {
  readonly name: SingleProvider;
  readonly modelName: string;

  isConfigured(): boolean;

  analyze(task: ProviderAnalyzeTask): Promise<ProviderExecutionResult>;
}
