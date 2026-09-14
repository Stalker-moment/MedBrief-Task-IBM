import Link from 'next/link';
import { ArrowUpRight, FileText, ShieldCheck, Sparkles, Check, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="fitur" className="hero-section scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 sm:py-16">
        <div className="hero-copy">
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase text-medisa-teal dark:text-teal-300 mb-6"><span className="w-6 h-px bg-medisa-teal" /> Catatan lebih jelas. Perawatan lebih fokus.</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-slate-900 dark:text-slate-100"><span className="headline-mask"><span>Dari catatan medis,</span></span><span className="headline-mask"><span className="text-medisa-teal dark:text-teal-300">jadi pemahaman.</span></span></h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">Bantu tenaga medis merangkum informasi penting, dan bantu pasien memahami catatannya. Satu ruang kerja, dua sudut pandang.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/analisis" className="motion-button inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-medisa-teal text-white font-semibold hover:bg-medisa-dark transition shadow-lg shadow-teal-900/10">Mulai analisis <ArrowUpRight className="w-5 h-5" /></Link>
            <a href="#cara-kerja" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition">Lihat cara kerja</a>
          </div>
          <p className="mt-5 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed"><ShieldCheck className="w-4 h-4 shrink-0 text-medisa-teal dark:text-teal-300" /> Gunakan data sintetis atau anonim. Hasil perlu ditinjau tenaga medis.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
            {['Form terpandu', 'Gemini & DeepSeek', 'Indonesia & English'].map(text => <span key={text} className="flex gap-1.5 items-center"><Check className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" />{text}</span>)}
          </div>
        </div>
        <div className="hero-visual relative rounded-[2rem] bg-[#e2efec] dark:bg-[#112e30] p-4 sm:p-7 border border-teal-900/10">
          <div className="flex flex-wrap gap-2 items-center justify-between text-xs text-teal-900 dark:text-teal-100 mb-5"><span className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Dari informasi ke pemahaman</span><span className="bg-white/70 dark:bg-slate-900/70 px-2 py-1 rounded-md text-[10px]">Ilustrasi hasil</span></div>
          <div className="bg-white/75 dark:bg-slate-900/75 rounded-2xl p-5 border border-white dark:border-slate-700">
            <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3"><FileText className="w-4 h-4" /> CATATAN SUMBER · SINTETIS</p>
            <p className="font-mono text-sm leading-7 text-slate-600 dark:text-slate-300">Keluhan sakit kepala sejak 4 hari.<br />Riwayat hipertensi. Alergi belum dicatat.<br />Rencana dokter: kontrol 2 minggu lagi.</p>
          </div>
          <div className="w-px h-6 bg-teal-600/30 mx-auto" />
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl shadow-teal-950/5 border border-teal-800/10">
            <div className="flex gap-2 items-center text-medisa-teal dark:text-teal-300 font-semibold text-sm pb-4 border-b border-slate-100 dark:border-slate-800"><BookOpen className="w-4 h-4" /> Ringkasan yang mudah dipahami</div>
            <dl className="mt-4 space-y-4 text-sm"><div><dt className="text-xs text-slate-500 dark:text-slate-400 mb-1">Keluhan utama</dt><dd className="font-medium text-slate-800 dark:text-slate-100">Sakit kepala selama 4 hari</dd></div><div><dt className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tindak lanjut dari catatan</dt><dd className="font-medium text-slate-800 dark:text-slate-100">Kontrol kembali dalam 2 minggu</dd></div></dl>
            <p className="mt-5 rounded-xl bg-amber-50 dark:bg-amber-900 border border-amber-100 dark:border-amber-800 px-3 py-2.5 text-xs text-amber-900 dark:text-amber-100">Perlu dilengkapi: informasi riwayat alergi.</p>
          </div>
          <p className="text-center mt-4 text-[11px] text-teal-900/70 dark:text-teal-100/70">Contoh tampilan, bukan hasil analisis pasien.</p>
        </div>
      </div>
    </section>
  );
}
