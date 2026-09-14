import { Request, Response, NextFunction } from 'express';

export interface LogMetadata {
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  provider?: string;
  characterCount?: number;
  [key: string]: unknown;
}

/**
 * Privacy-Preserving Logger for MediBrief.
 * CRITICAL RULE: Medical note contents (recordText), AI prompt text, raw model outputs,
 * patient identifiers, and secret keys must NEVER be logged.
 */
export class SafeLogger {
  private static sanitize(meta: LogMetadata): Record<string, unknown> {
    const safe: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(meta)) {
      // Strictly forbidden keys
      if (
        key === 'recordText' ||
        key === 'prompt' ||
        key === 'rawOutput' ||
        key === 'body' ||
        key === 'apiKey' ||
        key === 'authorization' ||
        key === 'cookie'
      ) {
        continue; // Never include
      }
      safe[key] = value;
    }

    return safe;
  }

  static info(message: string, meta: LogMetadata = {}): void {
    if (process.env.NODE_ENV === 'test' && !process.env.DEBUG_TESTS) {
      return;
    }
    const sanitized = this.sanitize(meta);
    console.log(
      JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        message,
        ...sanitized,
      })
    );
  }

  static warn(message: string, meta: LogMetadata = {}): void {
    if (process.env.NODE_ENV === 'test' && !process.env.DEBUG_TESTS) {
      return;
    }
    const sanitized = this.sanitize(meta);
    console.warn(
      JSON.stringify({
        level: 'warn',
        timestamp: new Date().toISOString(),
        message,
        ...sanitized,
      })
    );
  }

  static error(message: string, error?: unknown, meta: LogMetadata = {}): void {
    const sanitized = this.sanitize(meta);
    const errorMessage = error instanceof Error ? error.message : String(error ?? '');

    console.error(
      JSON.stringify({
        level: 'error',
        timestamp: new Date().toISOString(),
        message,
        error: errorMessage,
        ...sanitized,
      })
    );
  }
}

/**
 * Request Logging Middleware.
 * Records only method, URL, status code, duration, and non-sensitive metadata.
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Capture request start
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;

    // Log request summary without body content
    SafeLogger.info('HTTP Request', {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      characterCount: req.body?.recordText?.length,
      provider: req.body?.provider,
    });
  });

  next();
}
