import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env specifically, then fallback to current working directory .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  WEB_ORIGIN: z.string().default('http://localhost:3000'),

  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),

  DEEPSEEK_API_KEY: z.string().optional().default(''),
  DEEPSEEK_MODEL: z.string().default('deepseek-v4-flash'),

  ALLOW_PROVIDER_FALLBACK: z
    .string()
    .transform((val) => val === 'true' || val === '1')
    .default('false'),

  AI_TIMEOUT_MS: z.coerce.number().default(30000),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

function parseEnv(): EnvConfig {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ FATAL: Konfigurasi variabel lingkungan tidak valid:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Konfigurasi environment variable tidak valid.');
  }
  return result.data;
}

export const env = parseEnv();
