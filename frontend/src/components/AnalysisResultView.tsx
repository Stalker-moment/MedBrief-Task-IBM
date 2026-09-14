'use client';

import React, { useState, useEffect } from 'react';
import {
  RecordAnalyzeResponse,
  StructuredAnalysisResult,
  ProviderResultItem,
} from '@medibrief/shared';
import {
  FileText,
  UserCheck,
  HelpCircle,
  ShieldAlert,
  Copy,
  Download,
  Check,
  Clock,
  Cpu,
  CornerDownRight,
  AlertCircle,
  SplitSquareVertical,
  Volume2,
  VolumeX,
  Printer,
  Sparkles,
} from 'lucide-react';

interface AnalysisResultViewProps {
  response: RecordAnalyzeResponse;
  language?: 'id' | 'en';
}

export function AnalysisResultView({ response, language = 'id' }: AnalysisResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState('');
  const [activeTab, setActiveTab] = useState<'patient' | 'clinical' | 'missing' | 'safety'>('patient');
  const [activeCompareIndex, setActiveCompareIndex] = useState<number>(() => Math.max(0, response.completedResults.findIndex(item => item.result)));
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const isCompareMode = response.requestedProvider === 'compare';
  const completedResults = response.completedResults;

  // Primary result or active comparison result
  const currentResultItem: ProviderResultItem | undefined = isCompareMode
    ? completedResults[activeCompareIndex]
    : completedResults[0];

  const currentResult: StructuredAnalysisResult | null =
    isCompareMode ? currentResultItem?.result ?? null : currentResultItem?.result ?? response.validatedResult;

  // Stop speech when unmounting or tab changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab, activeCompareIndex]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  // Text to Speech for Patient Explanation
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setActionError('Fitur suara tidak didukung pada browser ini. Anda tetap dapat membaca atau mengunduh hasil.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!currentResult) return;

    setActionError('');
    const textToRead = [currentResult.patientExplanation.overview, currentResult.patientExplanation.medicinesMentioned, currentResult.patientExplanation.followUp].join('. ');

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'en' ? 'en-US' : 'id-ID';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Markdown exporter
  const generateMarkdown = (): string => {
    if (!currentResult) return '';
    const cs = currentResult.clinicalSummary;
    const pe = currentResult.patientExplanation;

    return `# MediBrief - Ringkasan Analisis Rekam Medis
*Model: ${currentResultItem?.model || response.actualModel} | Latensi: ${currentResultItem?.latencyMs || response.latencyMs}ms*

> **DISCLAIMER**: ${response.safetyDisclaimer}

---

## 1. Penjelasan Ramah Pasien (Patient Education)
### Rangkuman Kondisi:
${pe.overview}

### Panduan Obat:
${pe.medicinesMentioned}

### Langkah Tindak Lanjut:
${pe.followUp}

### Pertanyaan yang Disarankan untuk Dokter:
${pe.questionsForHealthcareProfessional.map((q) => `- ${q}`).join('\n')}

---

## 2. Ringkasan Klinis SOAP (Clinical Summary)
- **Keluhan Utama**: ${cs.chiefComplaint}
- **Riwayat Penyakit**: ${cs.relevantHistory}
- **Pengobatan Tercatat**: ${cs.medications}
- **Riwayat Alergi**: ${cs.allergies}
- **Pemeriksaan Fisik**: ${cs.examinationFindings}
- **Hasil Laboratorium**: ${cs.laboratoryFindings}
- **Assessment Sumber (Dokter)**: ${cs.assessmentFromSource}
- **Rencana Tindakan Sumber**: ${cs.planFromSource}
- **Rencana Kontrol**: ${cs.followUpFromSource}

---

## 3. Informasi Hilang & Berlawanan
### Informasi Hilang:
${currentResult.missingInformation.map((m) => `- ${m}`).join('\n') || '- Tidak ada'}

### Konflik Data / Berlawanan:
${currentResult.conflictingInformation.map((c) => `- ${c}`).join('\n') || '- Tidak ada'}

---

## 4. Catatan Keamanan
### Peringatan Medis Khusus:
${currentResult.safetyNotes.map((s) => `- ${s}`).join('\n') || '- Tidak ada'}

### Ketidakpastian:
${currentResult.uncertainties.map((u) => `- ${u}`).join('\n') || '- Tidak ada'}
`;
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdown());
      setActionError('');
      setCopied(true);
    } catch {
      setActionError('Teks belum tersalin. Izinkan akses clipboard atau gunakan Unduh Markdown.');
    }
  };

  const handleDownloadMarkdown = () => {
    const url = URL.createObjectURL(new Blob([generateMarkdown()], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `medibrief-${response.requestId.slice(0, 8)}-${currentResultItem?.provider ?? response.actualProvider}.md`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(response, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medibrief-analysis-${response.requestId.slice(0, 8)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      aria-label="Hasil Analisis Rekam Medis"
      className="analysis-result w-full min-w-0 break-words bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md shadow-slate-200/50 overflow-hidden animate-fade-in transition-all"
    >
      {/* Top Metadata & Action Bar */}
      <div className="bg-gradient-to-r from-slate-50 dark:from-slate-900 via-teal-50/30 dark:via-teal-900/30 to-slate-50 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-medisa-teal text-white font-bold shadow-2xs">
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{(currentResultItem?.provider ?? response.actualProvider).toUpperCase()}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full font-medium shadow-2xs">
            <span className="text-slate-400 font-mono text-[11px]">Model:</span>
            <strong className="text-slate-900 dark:text-slate-100">{currentResultItem?.model || response.actualModel}</strong>
          </span>

          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full font-medium shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{currentResultItem?.latencyMs ?? response.latencyMs} ms</span>
          </span>

          {response.fallbackApplied && (
            <span className="inline-flex items-center gap-1 text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 px-3 py-1 rounded-full font-bold">
              <CornerDownRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Fallback Otomatis</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="result-actions flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={toggleSpeech}
            disabled={!currentResult}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-100 border border-rose-300 dark:border-rose-700 animate-pulse'
                : 'bg-teal-50 dark:bg-teal-900 hover:bg-teal-100 dark:hover:bg-teal-900 text-medisa-dark dark:text-teal-200 border border-teal-200 dark:border-teal-700'
            }`}
            title="Dengarkan penjelasan pasien"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-rose-600 dark:text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" />}
            <span>{isPlayingAudio ? 'Hentikan Suara' : 'Dengarkan Audio'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            disabled={!currentResult}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full transition shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!currentResult}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full transition shadow-2xs"
            title="Cetak ringkasan"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button type="button" onClick={handleDownloadMarkdown} disabled={!currentResult} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"><Download className="w-3.5 h-3.5" />Unduh Markdown</button>
          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full transition shadow-2xs"
            title="Unduh JSON data mentah"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {actionError && <p role="alert" className="m-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900 text-sm text-amber-900 dark:text-amber-100">{actionError}</p>}
      <p role="status" className="sr-only">{copied ? 'Ringkasan berhasil disalin.' : ''}</p>
      <pre className="print-report">{generateMarkdown()}</pre>

      {/* Fallback Notice Banner if applied */}
      {response.fallbackApplied && response.fallbackReason && (
        <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-900 border-b border-amber-200 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-300 flex-shrink-0" />
          <span>{response.fallbackReason}</span>
        </div>
      )}

      {/* Comparison Selector if in compare mode */}
      {isCompareMode && (
        <div className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 px-5 sm:px-6 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
              <SplitSquareVertical className="w-4 h-4 text-medisa-teal dark:text-teal-300" />
              <span>Komparasi Multi-Provider AI (Pilih untuk Memeriksa):</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Kedua model dievaluasi secara independen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completedResults.map((item, idx) => {
              const isSelected = activeCompareIndex === idx;
              const hasError = item.result === null;

              return (
                <button
                  key={item.provider}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => { setActiveCompareIndex(idx); setIsPlayingAudio(false); setCopied(false); setActionError(''); }}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-medisa-teal shadow-sm ring-2 ring-medisa-teal/20'
                      : 'bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm text-slate-900 dark:text-slate-100 capitalize font-bold">{item.provider}</strong>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">({item.model})</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {hasError ? (
                        <span className="text-rose-600 dark:text-rose-300 font-bold">Gagal dieksekusi</span>
                      ) : (
                        <span>Waktu Respon: {item.latencyMs}ms</span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-medisa-teal mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modern Navigation Tabs (Medisa-Style) */}
      <div role="group" aria-label="Bagian hasil analisis" className="result-tabs flex border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 overflow-x-auto gap-4 pt-3">
        <button
          type="button"
          aria-pressed={activeTab === 'patient'}
          onClick={() => { setActiveTab('patient'); setIsPlayingAudio(false); }}
          className={`py-3 px-4.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'patient'
              ? 'border-medisa-teal text-medisa-teal dark:text-teal-300'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>1. Edukasi Ramah Pasien</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[10px] text-emerald-800 dark:text-emerald-100 font-bold">
            Utama
          </span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'clinical'}
          onClick={() => { setActiveTab('clinical'); setIsPlayingAudio(false); }}
          className={`py-3 px-4.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'clinical'
              ? 'border-medisa-teal text-medisa-teal dark:text-teal-300'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Ringkasan SOAP (Klinis)</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'missing'}
          onClick={() => { setActiveTab('missing'); setIsPlayingAudio(false); }}
          className={`py-3 px-4.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'missing'
              ? 'border-medisa-teal text-medisa-teal dark:text-teal-300'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>3. Data Hilang & Konflik</span>
          {((currentResult?.missingInformation.length || 0) +
            (currentResult?.conflictingInformation.length || 0) > 0) && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-800 dark:text-slate-100 font-extrabold">
              {(currentResult?.missingInformation.length || 0) +
                (currentResult?.conflictingInformation.length || 0)}
            </span>
          )}
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'safety'}
          onClick={() => { setActiveTab('safety'); setIsPlayingAudio(false); }}
          className={`py-3 px-4.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'safety'
              ? 'border-medisa-teal text-medisa-teal dark:text-teal-300'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>4. Peringatan Keamanan</span>
          {(currentResult?.safetyNotes.length || 0) > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-[10px] text-rose-700 dark:text-rose-300 font-extrabold">
              {currentResult?.safetyNotes.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="p-5 sm:p-8">
        {currentResultItem?.error ? (
          <div className="p-6 bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-300 mx-auto" />
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-100">Penyedia AI Ini Mengalami Kendala</h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{currentResultItem.error}</p>
          </div>
        ) : !currentResult ? (
          <div className="p-6 text-center text-slate-400">Tidak ada data hasil analisis.</div>
        ) : (
          <div>
            {/* TAB 1: Patient Education (Prioritized for Laypeople) */}
            {activeTab === 'patient' && (
              <div className="space-y-6 animate-fade-in">
                {/* Overview */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/90 dark:from-emerald-900/90 via-teal-50/50 dark:via-teal-900/50 to-white dark:to-slate-900 border border-emerald-200 dark:border-emerald-700 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                      <span>Rangkuman Kondisi Kesehatan Anda (Bahasa Ramah Awam)</span>
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-emerald-950 dark:text-emerald-100 leading-relaxed whitespace-pre-line font-medium">
                    {currentResult.patientExplanation.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Medicines Mentioned */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>💊 Panduan Obat yang Disebutkan</span>
                    </h4>
                    <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                      {currentResult.patientExplanation.medicinesMentioned}
                    </p>
                  </div>

                  {/* Follow-up Steps */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>🚶‍♂️ Langkah Tindak Lanjut yang Harus Dilakukan</span>
                    </h4>
                    <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                      {currentResult.patientExplanation.followUp}
                    </p>
                  </div>
                </div>

                {/* Questions for Healthcare Professional */}
                <div className="p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-700 shadow-2xs">
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-100 mb-3 flex items-center gap-2">
                    <span>❓ Pertanyaan yang Disarankan Ditanyakan Kepada Dokter Anda:</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-indigo-950 dark:text-indigo-100">
                    {currentResult.patientExplanation.questionsForHealthcareProfessional.map((q, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-medium pt-0.5">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: Clinical Summary (SOAP for Doctors) */}
            {activeTab === 'clinical' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chief Complaint */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Keluhan Utama (Chief Complaint)
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {currentResult.clinicalSummary.chiefComplaint}
                    </p>
                  </div>

                  {/* Allergies */}
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-100 uppercase tracking-wider block mb-1">
                      Riwayat Alergi (Allergies)
                    </span>
                    <p className="text-sm font-bold text-rose-950 dark:text-rose-100">
                      {currentResult.clinicalSummary.allergies}
                    </p>
                  </div>
                </div>

                {/* Relevant History */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Riwayat Penyakit & Pengobatan Terdahulu (History)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                    {currentResult.clinicalSummary.relevantHistory}
                  </p>
                </div>

                {/* Examination & Lab Findings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Pemeriksaan Fisik & Tanda Vital (Objective)
                    </span>
                    <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                      {currentResult.clinicalSummary.examinationFindings}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Hasil Laboratorium / Pemeriksaan Penunjang
                    </span>
                    <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                      {currentResult.clinicalSummary.laboratoryFindings}
                    </p>
                  </div>
                </div>

                {/* Assessment from Source */}
                <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-900 border border-teal-200 dark:border-teal-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-teal-900 dark:text-teal-100 uppercase tracking-wider">
                      Assessment / Diagnosis Sumber (DPJP)
                    </span>
                    <span className="text-[11px] text-teal-700 dark:text-teal-300 italic">Kutipan eksplisit catatan</span>
                  </div>
                  <p className="text-sm font-bold text-teal-950 dark:text-teal-100 whitespace-pre-line leading-relaxed">
                    {currentResult.clinicalSummary.assessmentFromSource}
                  </p>
                </div>

                {/* Plan & Follow-up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Rencana Tindakan Sumber (Plan)
                    </span>
                    <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                      {currentResult.clinicalSummary.planFromSource}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Rencana Kontrol / Evaluasi (Follow-Up)
                    </span>
                    <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                      {currentResult.clinicalSummary.followUpFromSource}
                    </p>
                  </div>
                </div>

                {/* Medications */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Daftar Obat Tercatat (Medications)
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                    {currentResult.clinicalSummary.medications}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Missing & Conflicting Information */}
            {activeTab === 'missing' && (
              <div className="space-y-6 animate-fade-in">
                {/* Missing Information */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                    <span>Informasi Medis yang Tidak Disebutkan / Perlu Dilengkapi</span>
                  </h3>

                  {currentResult.missingInformation.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                      Tidak ada informasi penting yang teridentifikasi hilang.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentResult.missingInformation.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-amber-50/70 dark:bg-amber-900/70 border border-amber-200 dark:border-amber-700 rounded-xl text-xs sm:text-sm text-amber-950 dark:text-amber-100 flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conflicting Information */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                    <span>Informasi Berlawanan / Inkonsistensi Data dalam Catatan</span>
                  </h3>

                  {currentResult.conflictingInformation.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                      Tidak ditemukan kontradiksi atau ketidakcocokan data dalam catatan medis.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentResult.conflictingInformation.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-xl text-xs sm:text-sm text-rose-950 dark:text-rose-100 flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 flex-shrink-0" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Safety Notes & Uncertainties */}
            {activeTab === 'safety' && (
              <div className="space-y-6 animate-fade-in">
                {/* Safety Notes */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                    <span>Catatan Keselamatan Medis Khusus (Alergi & Tanda Bahaya)</span>
                  </h3>

                  {currentResult.safetyNotes.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                      Tidak ada catatan keselamatan kritis tambahan.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentResult.safetyNotes.map((note, idx) => (
                        <div key={idx} className="p-4 bg-rose-50/90 dark:bg-rose-900/90 border border-rose-200 dark:border-rose-700 rounded-2xl text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 flex items-start gap-3 shadow-2xs">
                          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-300 mt-0.5 flex-shrink-0" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Uncertainties */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span>Hal yang Membutuhkan Konfirmasi Dokter / Nakes</span>
                  </h3>

                  {currentResult.uncertainties.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                      Tidak ada ketidakpastian yang memerlukan klarifikasi lebih lanjut.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentResult.uncertainties.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
