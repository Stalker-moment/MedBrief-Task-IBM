'use client';

import React, { useState } from 'react';
import {
  FileEdit,
  Cpu,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ClipboardList,
} from 'lucide-react';

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  return (
    <section id="cara-kerja" className="py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/70 to-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medisa-mint/80 border border-teal-200 text-medisa-dark text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-medisa-teal" />
            <span>Alur Kerja Cerdas & Terstandarisasi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dari Keluhan Sehari-hari Menjadi Rekam Medis Standar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            MediBrief menjembatani kesenjangan komunikasi antara bahasa awam pasien dan dokumentasi medis profesional tenaga kesehatan.
          </p>
        </div>

        {/* Step Selector Pills (Medisa-Style) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-slate-200/70 border border-slate-300/80 gap-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 1
                  ? 'bg-medisa-teal text-white shadow-md shadow-medisa-teal/20 scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
              <span>1. Input Terpandu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 2
                  ? 'bg-medisa-teal text-white shadow-md shadow-medisa-teal/20 scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
              <span>2. AI 8-Lapis</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 3
                  ? 'bg-medisa-teal text-white shadow-md shadow-medisa-teal/20 scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
              <span>3. Hasil Terstruktur</span>
            </button>
          </div>
        </div>

        {/* Dynamic Step Details Card */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg shadow-slate-200/50 transition-all">
          {activeStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="md:col-span-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-medisa-teal shadow-xs">
                  <FileEdit className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Form Terpandu: Bebas Bingung, Cukup Isi Poin Penting
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Orang awam sering kesulitan menuliskan keluhan dalam istilah medis. Dengan Form Terpandu, Anda cukup mengisi gejala yang dirasakan, lama sakit, obat yang sedang diminum, serta riwayat alergi.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</div>
                    <span>Pilihan tag gejala instan (Pusing, Demam, Nyeri Dada, Mual, dll).</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</div>
                    <span>Deteksi riwayat alergi obat sejak awal untuk mencegah malapraktik.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✓</div>
                    <span>Tersedia preset contoh kasus 1-klik untuk mencoba simulasi.</span>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 font-mono text-xs">
                <div className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                  Contoh Pengisian Terpandu:
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-medisa-teal font-bold block">Gejala:</span>
                  <span className="text-slate-700">Tengkuk berat, lemas 4 hari</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-purple-700 font-bold block">Riwayat Alergi:</span>
                  <span className="text-slate-700">Alergi Amoxicillin (gatal/ruam)</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-amber-700 font-bold block">Tanda Vital / Lab:</span>
                  <span className="text-slate-700">TD: 165/95 mmHg, GDS: 245 mg/dL</span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="md:col-span-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shadow-xs">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Rekayasa Prompt 8-Lapis & Penjaga Keamanan Medis
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Data yang dikirim dianalisis menggunakan SDK resmi model AI terkini (Google Gemini & DeepSeek). Sistem dilengkapi proteksi isolasi teks agar tidak rentan manipulasi (*Prompt Injection*).
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">✓</div>
                    <span>Pembatas ketat &lt;medical_record&gt; untuk menangkal serangan prompt override.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">✓</div>
                    <span>Validasi skema JSON Zod dengan auto-repair jika format tidak presisi.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs">✓</div>
                    <span>Zero Data Leaks: Log server di-masking agar privasi pasien tetap terjaga.</span>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-5 bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SECURITY ENGINE VERIFIED</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Layer 1: Role Authority Isolation<br/>
                  Layer 2: Prompt Injection Defense<br/>
                  Layer 3: Clinical SOAP Structuring<br/>
                  Layer 4: Patient Plain-Language Engine<br/>
                  Layer 5: Missing / Conflict Detection<br/>
                  Layer 6: Allergy & Red-Flag Warnings<br/>
                  Layer 7: Schema Strict Enforcement<br/>
                  Layer 8: Audit Logging Sanitization
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="md:col-span-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Hasil Terstruktur Ganda: Pasien Paham, Dokter Siap Tindak
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dalam sekali klik, Anda menerima output dua arah: penjelasan ramah pasien (lengkap dengan panduan obat dan daftar pertanyaan dokter), serta ringkasan klinis formal standar SOAP.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                    <BookOpen className="w-4 h-4 text-medisa-teal mb-1" />
                    <div className="text-xs font-bold text-slate-900">Bahasa Awam Pasien</div>
                    <div className="text-[11px] text-slate-500">Bebas istilah membingungkan</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <ClipboardList className="w-4 h-4 text-slate-800 mb-1" />
                    <div className="text-xs font-bold text-slate-900">Format SOAP Klinis</div>
                    <div className="text-[11px] text-slate-500">Siap diekspor ke rekam medis</div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-200/80 space-y-3 text-xs">
                <div className="text-xs font-bold text-teal-900">Fitur Dashboard Hasil:</div>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-medisa-teal font-bold">🔊</span>
                    <span>Putar Suara (Audio Read) untuk pasien</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-medisa-teal font-bold">📋</span>
                    <span>Salin Ringkasan / Ekspor Markdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-medisa-teal font-bold">🖨️</span>
                    <span>Cetak Lembar Edukasi Pasien</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-medisa-teal font-bold">⚖️</span>
                    <span>Komparasi Model Gemini vs DeepSeek</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
