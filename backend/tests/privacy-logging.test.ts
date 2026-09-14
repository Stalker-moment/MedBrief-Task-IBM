import { describe, it, expect, vi } from 'vitest';
import { SafeLogger } from '../src/middleware/logger.js';

describe('Privacy and Security Logging', () => {
  it('strips recordText, prompt, rawOutput, and apiKey from logs', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Temporarily allow test logging for this specific test
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const sensitiveClinicalNote = 'Pasien menderita HIV positif dan menggunakan obat anti-retroviral.';
    const secretApiKey = 'AIzaSySecretApiKey123456';

    SafeLogger.info('Testing privacy stripping', {
      requestId: 'test-req-privacy',
      recordText: sensitiveClinicalNote,
      prompt: 'Summarize HIV patient',
      rawOutput: 'Diagnosis: HIV',
      apiKey: secretApiKey,
      authorization: 'Bearer token',
      characterCount: sensitiveClinicalNote.length,
      provider: 'gemini',
    });

    expect(consoleLogSpy).toHaveBeenCalled();
    const loggedString = consoleLogSpy.mock.calls[0][0];

    // Must NOT contain sensitive clinical text
    expect(loggedString).not.toContain(sensitiveClinicalNote);
    expect(loggedString).not.toContain('HIV');
    expect(loggedString).not.toContain(secretApiKey);
    expect(loggedString).not.toContain('Bearer token');

    // Safe metadata MUST be present
    expect(loggedString).toContain('test-req-privacy');
    expect(loggedString).toContain('characterCount');
    expect(loggedString).toContain('gemini');

    consoleLogSpy.mockRestore();
    process.env.NODE_ENV = origEnv;
  });
});
