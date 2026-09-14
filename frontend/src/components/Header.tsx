'use client';

import React, { useState, useEffect } from 'react';
import { Stethoscope, ShieldCheck, Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { DISCLAIMER_ID } from '@medibrief/shared';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Topmost Medical Guard Notice */}
      <aside
        aria-label="Pemberitahuan Kepatuhan Medis"
        className="w-full bg-slate-900 text-slate-200 px-4 py-2 text-[11px] sm:text-xs font-medium border-b border-slate-800 flex items-center justify-between gap-3"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-[10px]">
              Multi-Provider AI
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 truncate max-w-md sm:max-w-xl">
              {DISCLAIMER_ID}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
            <span>Simulasi Sintetis & De-Identified</span>
          </div>
        </div>
      </aside>

      {/* Modern Floating Pill Navbar (Inspired by Medisa.io) */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'py-2 bg-white/90 backdrop-blur-md shadow-sm' : 'py-4 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/95 px-4 sm:px-6 py-2.5 shadow-sm shadow-slate-200/50 backdrop-blur-lg">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-medisa-dark via-medisa-teal to-medisa-light flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Stethoscope className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-medisa-teal transition-colors">
                  MediBrief<span className="text-medisa-teal font-extrabold">.ai</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Asisten Rekam Medis</span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
              <a href="#fitur" className="hover:text-medisa-teal transition-colors">
                Fitur Unggulan
              </a>
              <a href="#cara-kerja" className="hover:text-medisa-teal transition-colors">
                Alur 3 Langkah
              </a>
              <a href="#keamanan" className="hover:text-medisa-teal transition-colors">
                Keamanan & Privasi
              </a>
            </div>

            {/* CTA & Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={scrollToWorkspace}
                className="inline-flex items-center gap-2 rounded-full border-2 border-medisa-mint bg-medisa-teal hover:bg-medisa-dark text-white px-5 py-2 text-xs font-bold shadow-md shadow-medisa-teal/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-medisa-accent animate-pulse" aria-hidden="true" />
                <span>Mulai Analisis</span>
                <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" aria-hidden="true" />
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-full text-slate-600 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3 animate-fade-in">
              <a
                href="#fitur"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-medisa-teal py-1.5"
              >
                Fitur Unggulan
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-medisa-teal py-1.5"
              >
                Alur 3 Langkah
              </a>
              <a
                href="#keamanan"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 hover:text-medisa-teal py-1.5"
              >
                Keamanan & Privasi
              </a>
              <button
                onClick={scrollToWorkspace}
                className="w-full text-center py-2.5 rounded-xl bg-medisa-teal text-white text-xs font-bold"
              >
                Buka Form Analisis
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
