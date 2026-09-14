'use client';

import React, { useState, useRef } from 'react';
import { RecordAnalyzeResponse } from '@medibrief/shared';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { WorkflowSection } from '@/components/WorkflowSection';
import { MedicalRecordInput, AnalyzeFormValues } from '@/components/MedicalRecordInput';
import { AnalysisResultView } from '@/components/AnalysisResultView';
import { DisclaimerNotice } from '@/components/DisclaimerNotice';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [result, setResult] = useState<RecordAnalyzeResponse | null>(null);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<AnalyzeFormValues | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleAnalyze = async (values: AnalyzeFormValues) => {
    setIsLoading(true);
    setError(null);
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

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error?.message ||
          (data.error?.issues
            ? data.error.issues.map((i: { message: string }) => i.message).join(', ')
            : 'Gagal menganalisis catatan rekam medis.');

        setError({
          message: errorMsg,
          code: data.error?.code || `HTTP_${response.status}`,
        });
        return;
      }

      setResult(data as RecordAnalyzeResponse);

      // Smooth scroll down to results after processing
      setTimeout(() => {
        const resultSection = document.querySelector('section[aria-label="Hasil Analisis Rekam Medis"]');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was intentionally cancelled
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Koneksi ke backend server gagal.';

      setError({
        message: `${errorMessage}. Pastikan Express API sedang berjalan di ${API_BASE_URL}.`,
        code: 'NETWORK_ERROR',
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    if (lastSubmittedValues) {
      handleAnalyze(lastSubmittedValues);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb]">
      {/* Top Floating Pill Navigation */}
      <Header />

      {/* Main Landing Page Experience */}
      <HeroSection />

      <WorkflowSection />

      {/* Interactive Core Workspace Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
            className="p-5 bg-rose-50 border border-rose-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in"
          >
            <div className="flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-rose-950">Gagal Memproses Permintaan</h3>
                  {error.code && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 font-bold">
                      {error.code}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">{error.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setError(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
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
        {result && <AnalysisResultView response={result} />}
      </main>

      {/* Safety & Legal Disclaimer Notice */}
      <DisclaimerNotice />
    </div>
  );
}
