import { FileEdit, Sparkles, ClipboardCheck } from 'lucide-react';

const steps = [
  { icon: FileEdit, title: 'Masukkan catatan', text: 'Isi form terpandu atau tempel catatan anonim. Tersedia contoh sintetis untuk mencoba.' },
  { icon: Sparkles, title: 'Pilih & analisis', text: 'Pilih penyedia AI, audiens, dan bahasa. Bandingkan hasil dua penyedia bila diperlukan.' },
  { icon: ClipboardCheck, title: 'Tinjau hasilnya', text: 'Periksa ringkasan, informasi yang hilang, dan peringatan. Salin, unduh, atau cetak hasil.' },
];

export function WorkflowSection() {
  return (
    <section id="cara-kerja" aria-label="Cara kerja" className="scroll-mt-28 border-y border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-7 md:gap-8">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="flex gap-4">
              <div className="w-11 h-11 shrink-0 bg-teal-50 dark:bg-teal-900 rounded-xl border border-teal-100 dark:border-teal-800 flex items-center justify-center"><Icon className="w-5 h-5 text-medisa-teal dark:text-teal-300" /></div>
              <div><h2 className="text-sm font-bold text-slate-800 dark:text-slate-100"><span className="text-medisa-teal dark:text-teal-300 mr-2">0{index + 1}</span>{title}</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
