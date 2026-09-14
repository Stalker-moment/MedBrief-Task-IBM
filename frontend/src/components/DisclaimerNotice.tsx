'use client';

import React from 'react';
import { Lock, FileText, Info } from 'lucide-react';

export function DisclaimerNotice() {
  return (
    <footer id="keamanan" className="scroll-mt-28 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-12 py-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">Privasi Tanpa Penyimpanan</h4>
              <p>
                MediBrief tidak menyimpan teks rekam medis di database, log server, maupun memori lokal browser (localStorage/cookies).
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">Batasan Klinis</h4>
              <p>
                Asisten dokumentasi dan edukasi. Bukan alat diagnostik medis, bukan perencana terapi, dan bukan pengganti dokter.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">Status Proyek</h4>
              <p>
                Proyek capstone edukasional demonstrasi arsitektur AI kesehatan multi-provider (Google Gemini & DeepSeek).
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center text-slate-400">
          <p>© 2026 MediBrief. Khusus untuk catatan rekam medis sintetis atau data anonim.</p>
        </div>
      </div>
    </footer>
  );
}
