import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ruang Analisis | MediBrief',
  description: 'Rangkum catatan medis sintetis atau anonim menjadi ringkasan klinis dan edukasi pasien.',
};

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
