import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediBrief - Asisten Ringkasan Rekam Medis & Edukasi Pasien',
  description:
    'Asisten dokumentasi klinis berbasis AI untuk menyederhanakan dan menstrukturkan rekam medis sintetis dengan Google Gemini dan DeepSeek.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
