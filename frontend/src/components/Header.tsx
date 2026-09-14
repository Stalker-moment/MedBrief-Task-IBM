'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, ArrowUpRight, ArrowLeft, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeProvider';

export function Header({ analysis = false }: { analysis?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = analysis
    ? [{ href: '/', label: 'Beranda' }, { href: '/#cara-kerja', label: 'Cara kerja' }, { href: '#keamanan', label: 'Privasi' }]
    : [{ href: '#fitur', label: 'Tentang MediBrief' }, { href: '#cara-kerja', label: 'Cara kerja' }, { href: '#keamanan', label: 'Privasi' }];
  return (
    <>
      <aside aria-label="Pemberitahuan Kepatuhan Medis" className="medical-notice px-4 py-2 text-center text-[11px] leading-relaxed">Asisten dokumentasi & edukasi. <span className="font-semibold">BUKAN pengganti dokter.</span></aside>
      <header className="site-header sticky top-0 z-50" onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setMobileMenuOpen(false);
          (event.currentTarget.querySelector('[aria-controls="mobile-menu"]') as HTMLButtonElement)?.focus();
        }
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Navigasi utama" className="flex items-center justify-between gap-3 py-4 border-b border-slate-200 dark:border-slate-700">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="MediBrief — Beranda">
              <span className="w-10 h-10 rounded-xl bg-medisa-teal flex items-center justify-center text-white"><Stethoscope className="w-5 h-5" aria-hidden="true" /></span>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">MediBrief<span className="text-medisa-teal dark:text-teal-300">.ai</span></span>
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300 font-medium">
              {links.map(link => <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>)}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link href={analysis ? '/' : '/analisis'} className="motion-button hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full bg-medisa-teal text-white text-xs font-semibold">
                {analysis ? <><ArrowLeft className="w-4 h-4" /> Beranda</> : <>Mulai analisis <ArrowUpRight className="w-4 h-4" /></>}
              </Link>
              <button type="button" className="lg:hidden w-11 h-11 rounded-full inline-flex justify-center items-center text-slate-600 dark:text-slate-300" aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
          {mobileMenuOpen && <nav id="mobile-menu" aria-label="Navigasi seluler" className="mobile-navigation lg:hidden py-4 space-y-1">
            {links.map(link => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium text-slate-700 dark:text-slate-300">{link.label}</Link>)}
            <Link href="/analisis" onClick={() => setMobileMenuOpen(false)} className="flex justify-between items-center py-3 font-semibold text-medisa-teal dark:text-teal-300">Buka halaman analisis <ArrowUpRight className="w-4 h-4" /></Link>
          </nav>}
        </div>
      </header>
    </>
  );
}
