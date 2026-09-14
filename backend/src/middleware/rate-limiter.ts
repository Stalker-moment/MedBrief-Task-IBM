import rateLimit from 'express-rate-limit';

/**
 * Rate limiter preventing abuse of AI endpoints.
 * 40 requests per 15 minutes per IP.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba kembali.',
    },
  },
  skip: () => process.env.NODE_ENV === 'test',
});
