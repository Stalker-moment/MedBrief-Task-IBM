import Link from 'next/link';
import { ArrowUpRight, FileHeart, BookOpen, ScanLine, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { WorkflowSection } from '@/components/WorkflowSection';
import { DisclaimerNotice } from '@/components/DisclaimerNotice';
import { Reveal } from '@/components/Reveal';

const features = [
  { icon: FileHeart, number: '01', title: 'Informasi penting, tersusun.', text: 'Keluhan, riwayat, obat, dan tindak lanjut dari catatan sumber dalam ringkasan klinis yang terstruktur.' },
  { icon: BookOpen, number: '02', title: 'Bahasa yang lebih dekat.', text: 'Penjelasan ramah pasien dan pertanyaan untuk dibawa saat berkonsultasi dengan tenaga medis.' },
  { icon: ScanLine, number: '03', title: 'Yang terlewat, terlihat.', text: 'Tinjau informasi yang belum dicatat, data yang bertentangan, dan hal yang perlu dikonfirmasi.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">Langsung ke konten</a>
      <Header />
      <main id="main-content">
        <HeroSection />
        <Reveal><WorkflowSection /></Reveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="features-heading">
          <Reveal><div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10"><div><p className="eyebrow">SATU CATATAN, DUA SUDUT PANDANG</p><h2 id="features-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-4">Lebih mudah dibaca.<br /><span className="text-medisa-teal dark:text-teal-300">Lebih siap dipahami.</span></h2></div><p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">Dibuat untuk membantu dokumentasi dan percakapan antara tenaga medis dan pasien.</p></div></Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, number, title, text }) => <Reveal key={number} className="h-full"><article className="feature-card h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-7"><div className="flex items-center justify-between mb-10"><Icon className="w-6 h-6 text-medisa-teal dark:text-teal-300" /><span className="font-mono text-xs text-slate-400">/{number}</span></div><h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{text}</p></article></Reveal>)}
          </div>
        </section>
        <Reveal><section className="landing-cta mx-4 sm:mx-6 lg:mx-auto max-w-[1216px] rounded-3xl p-7 sm:p-12 flex flex-col md:flex-row justify-between gap-8 md:items-center"><div><p className="flex gap-2 items-center text-xs font-medium mb-4"><ShieldCheck className="w-4 h-4" /> Mulai dengan data sintetis</p><h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Dari sini, semuanya<br />jadi lebih jelas.</h2><p className="mt-4 text-sm opacity-80">Coba contoh yang tersedia, tanpa membuat akun.</p></div><Link href="/analisis" className="motion-button inline-flex items-center justify-center gap-5 rounded-full bg-white dark:bg-slate-900 text-teal-950 dark:text-teal-100 px-7 py-4 font-semibold self-start">Buka ruang analisis <ArrowUpRight className="w-5 h-5" /></Link></section></Reveal>
      </main>
      <DisclaimerNotice />
    </div>
  );
}
