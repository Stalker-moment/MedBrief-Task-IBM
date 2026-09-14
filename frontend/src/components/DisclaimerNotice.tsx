'use client';

import React from 'react';
import { Lock, FileText, Info } from 'lucide-react';

export function DisclaimerNotice() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Privasi Tanpa Penyimpanan</h4>
              <p>
                MediBrief tidak menyimpan teks rekam medis di database, log server, maupun memori lokal browser (localStorage/cookies).
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Batasan Klinis</h4>
              <p>
                Asisten dokumentasi dan edukasi. Bukan alat diagnostik medis, bukan perencana terapi, dan bukan pengganti dokter.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Info className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Status Proyek</h4>
              <p>
                Proyek capstone edukasional demonstrasi arsitektur AI kesehatan multi-provider (Google Gemini & DeepSeek).
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 text-center text-slate-400">
          <p>© 2026 MediBrief. Khusus untuk catatan rekam medis sintetis atau data anonim.</p>
        </div>
      </div>
    </footer>
  );
}
