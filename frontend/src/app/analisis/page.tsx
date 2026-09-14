'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RecordAnalyzeResponse, RecordAnalyzeResponseSchema } from '@medibrief/shared';
import { Header } from '@/components/Header';
import { MedicalRecordInput, AnalyzeFormValues } from '@/components/MedicalRecordInput';
import { AnalysisResultView } from '@/components/AnalysisResultView';
import { DisclaimerNotice } from '@/components/DisclaimerNotice';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function AnalysisPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [result, setResult] = useState<RecordAnalyzeResponse | null>(null);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<AnalyzeFormValues | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  useEffect(() => () => abortControllerRef.current?.abort(), []);
  useEffect(() => {
    if (result) {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleAnalyze = async (values: AnalyzeFormValues) => {
    abortControllerRef.current?.abort();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastSubmittedValues(values);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/medical-records/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);
      if (abortControllerRef.current !== controller) return;

      if (!response.ok) {
        const errorMsg =
          data?.error?.message ||
          (data?.error?.issues
            ? data.error.issues.map((i: { message: string }) => i.message).join(', ')
            : 'Gagal menganalisis catatan rekam medis.');

        setError({
          message: errorMsg,
          code: data?.error?.code || `HTTP_${response.status}`,
        });
        return;
      }

      const parsed = RecordAnalyzeResponseSchema.safeParse(data);
      if (!parsed.success || !parsed.data.completedResults.some(item => item.result)) {
        setError({ message: 'Respons analisis tidak lengkap. Silakan coba lagi.', code: 'INVALID_RESPONSE' });
        return;
      }
      setResult(parsed.data);
    } catch {
      if (controller.signal.aborted || abortControllerRef.current !== controller) {
        // Request was intentionally cancelled
        return;
      }

      setError({
        message: 'Tidak dapat terhubung ke layanan analisis. Periksa koneksi Anda lalu coba lagi.',
        code: 'NETWORK_ERROR',
      });
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleRetry = () => {
    if (lastSubmittedValues) {
      handleAnalyze(lastSubmittedValues);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb] dark:bg-[#0b1519]">
      <a href="#workspace" className="skip-link">Langsung ke form analisis</a>
      {/* Top Floating Pill Navigation */}
      <Header analysis />



      {/* Interactive Core Workspace Section */}
      <main id="main-content" className="page-enter flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="workspace-heading"><p className="eyebrow">RUANG KERJA / ANALISIS</p><h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 text-slate-900 dark:text-slate-100">Catatan masuk. Pemahaman keluar.</h1><p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base">Isi catatan, pilih pengaturan, lalu tinjau ringkasan Anda.</p></div>
        {/* Medical Record Guided & Raw Input Component */}
        <MedicalRecordInput
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          onCancel={handleCancel}
        />

        {/* Error Feedback with Retry Action */}
        {error && (
          <div
            role="alert"
            className="p-5 bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in"
          >
            <div className="flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-300 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-rose-950 dark:text-rose-100">Gagal Memproses Permintaan</h3>
                  {error.code && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100 font-bold">
                      {error.code}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-100 mt-1 leading-relaxed">{error.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setError(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full"
                title="Tutup Pesan Error"
              >
                <XCircle className="w-4 h-4" />
              </button>
              {lastSubmittedValues && (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full transition shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Analysis Result Display */}
        {isLoading && <div role="status" className="rounded-2xl border border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900 p-5 text-sm text-teal-900 dark:text-teal-100">Sedang menyusun ringkasan dan memeriksa informasi. Anda dapat membatalkan proses melalui tombol di atas.</div>}
        {!result && !isLoading && !error && <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center"><h2 className="font-semibold text-slate-700 dark:text-slate-300">Ringkasan Anda akan tampil di sini</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Mulai dari contoh sintetis atau isi catatan, lalu pilih Analisis.</p></div>}
        {result && <section ref={resultRef} tabIndex={-1} aria-label="Hasil terbaru" className="scroll-mt-28"><AnalysisResultView key={result.requestId} response={result} language={lastSubmittedValues?.language} /></section>}
      </main>

      {/* Safety & Legal Disclaimer Notice */}
      <DisclaimerNotice />
    </div>
  );
}
