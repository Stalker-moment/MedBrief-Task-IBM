'use client';

import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Users2,
  ArrowDown,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export function HeroSection() {
  const scrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToWorkflow = () => {
    const el = document.getElementById('cara-kerja');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Background Soft Glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-medisa-mint/60 via-teal-50/40 to-transparent blur-3xl -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-gradient-to-r from-teal-50 via-white to-emerald-50 px-4 py-1.5 shadow-sm">
          <HeartPulse className="w-4 h-4 text-medisa-teal animate-pulse" aria-hidden="true" />
          <span className="text-xs font-semibold text-slate-800 tracking-wide">
            Asisten Cerdas Rekam Medis & Edukasi Pasien
          </span>
          <span className="text-[10px] font-bold bg-medisa-teal text-white px-2 py-0.5 rounded-full">
            Dual AI Engine
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Pahami Rekam Medis Lebih Jelas.{' '}
          <span className="bg-gradient-to-r from-medisa-teal via-teal-700 to-emerald-600 bg-clip-text text-transparent">
            Rawat Pasien Lebih Fokus.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
          Ubah catatan medis yang rumit menjadi <strong className="text-slate-800 font-semibold">Ringkasan Klinis SOAP Terstruktur</strong> untuk tenaga medis dan <strong className="text-slate-800 font-semibold">Panduan Ramah Awam</strong> untuk pasien. Kini dilengkapi <span className="text-medisa-teal font-semibold">Form Terpandu</span> agar siapapun bisa mengisi data kesehatan tanpa bingung.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={scrollToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-medisa-teal hover:bg-medisa-dark text-white px-8 py-3.5 text-sm font-bold shadow-lg shadow-medisa-teal/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-medisa-accent" aria-hidden="true" />
            <span>Coba Form Terpandu Sekarang</span>
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={scrollToWorkflow}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            <span>Pelajari Alur Kerja</span>
          </button>
        </div>

        {/* Trust Badges Strip */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medisa-teal flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Form Terarah</div>
              <div className="text-[11px] text-slate-500">Mudah diisi orang awam</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Privasi Aman</div>
              <div className="text-[11px] text-slate-500">Data sintetis & PII free</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Gemini & DeepSeek</div>
              <div className="text-[11px] text-slate-500">Komparasi side-by-side</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Dual Bahasa</div>
              <div className="text-[11px] text-slate-500">Klinis & Edukasi Pasien</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
