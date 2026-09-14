import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { SafeLogger } from './logger.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.id || 'unknown';

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    SafeLogger.warn('Validation error', {
      requestId,
      statusCode: 400,
      path: req.path,
    });

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data input tidak memenuhi validasi skema.',
        issues: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
        requestId,
      },
    });
    return;
  }

  // 2. Custom App Error
  if (err instanceof AppError) {
    SafeLogger.warn(`AppError: ${err.code}`, {
      requestId,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
    return;
  }

  // 3. Body Parser Syntax Error (malformed JSON in request)
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({
      error: {
        code: 'MALFORMED_JSON',
        message: 'Format JSON pada request body tidak valid.',
        requestId,
      },
    });
    return;
  }

  // 4. Unhandled / Internal Server Error
  SafeLogger.error('Unhandled internal server error', err, {
    requestId,
    url: req.originalUrl,
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kendala pada server internal. Silakan coba kembali sesaat lagi.',
      requestId,
    },
  });
}
