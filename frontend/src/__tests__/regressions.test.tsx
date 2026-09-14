import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MedicalRecordInput } from '../components/MedicalRecordInput';
import { AnalysisResultView } from '../components/AnalysisResultView';
import AnalysisPage from '../app/analisis/page';
import type { RecordAnalyzeResponse, StructuredAnalysisResult } from '@medibrief/shared';

const analysis: StructuredAnalysisResult = {
  clinicalSummary: { chiefComplaint: 'Keluhan sintetis', relevantHistory: 'Tidak disebutkan', medications: 'Tidak disebutkan', allergies: 'Tidak disebutkan', examinationFindings: 'Tidak disebutkan', laboratoryFindings: 'Tidak disebutkan', assessmentFromSource: 'Tidak disebutkan', planFromSource: 'Tidak disebutkan', followUpFromSource: 'Kontrol sesuai catatan' },
  patientExplanation: { overview: 'Ringkasan contoh dari DeepSeek', medicinesMentioned: 'Tidak disebutkan', followUp: 'Kontrol sesuai catatan', questionsForHealthcareProfessional: [] },
  missingInformation: ['Riwayat alergi'], conflictingInformation: [], uncertainties: [], safetyNotes: [],
};
const response: RecordAnalyzeResponse = {
  requestId: '6e25f4cd-9e45-4d8c-8641-4a78ab0b71d0', requestedProvider: 'compare', actualProvider: 'deepseek', actualModel: 'test-model',
  completedResults: [
    { provider: 'gemini', model: 'gemini-test', latencyMs: 0, result: null, error: 'Provider unavailable' },
    { provider: 'deepseek', model: 'deepseek-test', latencyMs: 12, result: analysis, error: null },
  ], fallbackApplied: false, fallbackReason: null, latencyMs: 12, safetyDisclaimer: 'Bukan pengganti dokter.', validatedResult: analysis,
};
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function renderInput() {
  const onSubmit = vi.fn();
  render(<MedicalRecordInput onSubmit={onSubmit} onCancel={vi.fn()} isLoading={false} />);
  return onSubmit;
}

describe('Input regression checks', () => {
  it('does not invent a negative allergy history when the field is blank', () => {
    const submit = renderInput();
    fireEvent.change(screen.getByLabelText(/Apa Keluhan/), { target: { value: 'Catatan keluhan sintetis untuk pengujian' } });
    fireEvent.click(screen.getByRole('button', { name: 'Analisis Rekam Medis Sekarang' }));
    expect(submit.mock.calls[0][0].recordText).toContain('Riwayat Alergi: Tidak disebutkan');
  });
  it('rejects whitespace-only raw input and overlong guided input', () => {
    const submit = renderInput();
    fireEvent.change(screen.getByLabelText(/Apa Keluhan/), { target: { value: 'a'.repeat(20001) } });
    expect((screen.getByRole('button', { name: 'Analisis Rekam Medis Sekarang' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Catatan Bebas/ }));
    fireEvent.change(screen.getByLabelText('Isi Catatan Rekam Medis'), { target: { value: ' '.repeat(30) } });
    expect((screen.getByRole('button', { name: 'Analisis Rekam Medis Sekarang' }) as HTMLButtonElement).disabled).toBe(true);
    expect(submit).not.toHaveBeenCalled();
  });
  it('keeps pediatric demographic values selectable and exposes editable lab data', () => {
    renderInput();
    fireEvent.click(screen.getByRole('button', { name: /Anak Demam/ }));
    expect((screen.getByLabelText('Jenis Kelamin') as HTMLSelectElement).value).toBe('Laki-laki');
    expect((screen.getByLabelText('Hasil Lab / Temuan Lainnya') as HTMLTextAreaElement).value).toContain('Nadi 110');
    expect((screen.getByLabelText('Tekanan Darah (TD)') as HTMLInputElement).value).toBe('');
  });
});

describe('Result regression checks', () => {
  it('selects the successful provider and prevents exporting another provider under a failed provider', () => {
    render(<AnalysisResultView response={response} />);
    expect(screen.getByRole('button', { name: /deepseek.*deepseek-test/i }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: /gemini.*gemini-test/i }));
    expect(screen.getByText('Provider unavailable')).toBeDefined();
    expect((screen.getByRole('button', { name: 'Salin Teks' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Dengarkan Audio' }) as HTMLButtonElement).disabled).toBe(true);
  });
  it('shows a useful fallback when clipboard access is denied', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    render(<AnalysisResultView response={response} />);
    fireEvent.click(screen.getByRole('button', { name: 'Salin Teks' }));
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Teks belum tersalin. Izinkan akses clipboard atau gunakan Unduh Markdown.');
  });
  it('uses the selected language and cancels audio on section changes', () => {
    const speech = { cancel: vi.fn(), speak: vi.fn() };
    vi.stubGlobal('speechSynthesis', speech);
    vi.stubGlobal('SpeechSynthesisUtterance', class { lang = ''; constructor(public text: string) {} });
    render(<AnalysisResultView response={response} language="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Dengarkan Audio' }));
    expect(speech.speak.mock.calls[0][0].lang).toBe('en-US');
    speech.cancel.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /Ringkasan SOAP/ }));
    expect(speech.cancel).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Dengarkan Audio' })).toBeDefined();
  });
});

describe('Request lifecycle regression checks', () => {
  it('does not let a cancelled request clear the next request loading state', async () => {
    let rejectFirst!: (reason: Error) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectFirst = reject; }))
      .mockImplementationOnce(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);
    render(<AnalysisPage />);
    fireEvent.click(screen.getByRole('button', { name: /Tensi & Gula/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Analisis Rekam Medis Sekarang' }));
    fireEvent.click(screen.getByRole('button', { name: 'Batalkan' }));
    fireEvent.click(screen.getByRole('button', { name: 'Analisis Rekam Medis Sekarang' }));
    await act(async () => rejectFirst(new DOMException('Cancelled', 'AbortError')));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Batalkan' })).toBeDefined();
    expect((screen.getByRole('button', { name: 'Menganalisis Rekam Medis...' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Batalkan' }));
    expect(fetchMock.mock.calls[1][1].signal.aborted).toBe(true);
  });
  it('handles a malformed successful response without crashing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    render(<AnalysisPage />);
    fireEvent.click(screen.getByRole('button', { name: /Tensi & Gula/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Analisis Rekam Medis Sekarang' }));
    await waitFor(() => expect(screen.getByText('INVALID_RESPONSE')).toBeDefined());
    expect(screen.getByRole('button', { name: 'Coba Lagi' })).toBeDefined();
  });
});
