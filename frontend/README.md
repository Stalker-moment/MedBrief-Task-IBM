# 🌐 MediBrief Frontend Web

Aplikasi web antarmuka pengguna (*Indonesian-first user interface*) untuk sistem **MediBrief** — Asisten Dokumentasi Rekam Medis & Edukasi Pasien. Dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, dan **TypeScript**.

---

## 📑 Daftar Isi

1. [Fitur & Pengalaman Pengguna (UX)](#-fitur--pengalaman-pengguna-ux)
2. [Struktur Halaman & Komponen](#-struktur-halaman--komponen)
3. [Prasyarat Sistem](#-prasyarat-sistem)
4. [Variabel Lingkungan (.env)](#-variabel-lingkungan-env)
5. [Instalasi & Menjalankan Aplikasi](#-instalasi--menjalankan-aplikasi)
6. [Panduan Deployment (Vercel)](#-panduan-deployment-vercel)
7. [Aksesibilitas & Tema (Dark/Light)](#-aksesibilitas--tema-darklight)
8. [Pengujian Otomatis (Frontend Testing)](#-pengujian-otomatis-frontend-testing)

---

## ✨ Fitur & Pengalaman Pengguna (UX)

- **Dedicated Multi-Page Flow**:
  - `/` : Landing page pengenalan MediBrief, fitur unggulan, dan alur kerja klinis.
  - `/analisis` : Ruang kerja analisis interaktif khusus, terisolasi dari landing page agar pengguna fokus menelaah data.
- **Form Masukan Cerdas**:
  - Penghitung karakter *real-time* dengan validasi rentang aman (20 – 20.000 karakter).
  - Pilihan sampel rekam medis sintetis (Hipertensi/DM, Alergi, Kasus Kompleks, dll.) untuk demonstrasi instan.
  - Dukungan pemilihan provider: **Google Gemini**, **DeepSeek**, atau **Mode Komparasi (*Compare*)**.
  - Pilihan bahasa target: Bahasa Indonesia (`id`) atau Bahasa Inggris (`en`).
- **Tampilan Hasil Analisis Komprehensif**:
  - **Tab Klinis**: Ringkasan Klinis formal untuk dokter, Edukasi Pasien ramah awam, Informasi Hilang/Konflik, dan Catatan Keamanan.
  - **Mode Komparasi Berdampingan (*Side-by-Side*)**: Menampilkan hasil Gemini dan DeepSeek secara simultan untuk membandingkan konsistensi ekstraksi klinis.
  - **Ekspor Dokumen**: Unduh hasil analisis dalam format Markdown (`.md`) atau JSON terstruktur (`.json`).
  - **Audio/Speech Fallback**: Fitur pembacaan edukasi pasien dengan Web Speech API bawaan peramban.
- **Kepatuhan Privasi Mutlak**: Tidak ada rekam medis yang disimpan di `localStorage` atau `sessionStorage`. Hanya preferensi tema tampilan yang disimpan.

---

## 📂 Struktur Halaman & Komponen

```text
frontend/
├── .env.example              # Template variabel lingkungan
├── .env.local                # File konfigurasi lokal (jangan di-commit)
├── .npmrc                    # Konfigurasi npm (install-links=true)
├── package.json              # Definisi dependensi & script frontend
├── next.config.ts            # Konfigurasi Next.js (Turbopack, Security Headers)
├── tailwind.config.ts        # Desain tema, warna klinis, & animasi Tailwind
├── tsconfig.json             # Konfigurasi TypeScript Next.js
├── vitest.config.ts          # Konfigurasi unit/smoke test frontend
│
└── src/
    ├── app/
    │   ├── layout.tsx        # Root layout, Google Fonts, ThemeProvider
    │   ├── page.tsx          # Landing page utama (/)
    │   ├── analisis/
    │   │   └── page.tsx      # Halaman workspace analisis rekam medis (/analisis)
    │   └── globals.css       # Token CSS kustom, transisi tema, & animasi
    │
    ├── components/
    │   ├── Header.tsx            # Navigasi atas, status badge, & toggle tema
    │   ├── HeroSection.tsx       # Banner hero interaktif landing page
    │   ├── WorkflowSection.tsx   # Visualisasi 4 tahap kerja MediBrief
    │   ├── Reveal.tsx            # Wrapper animasi muncul saat scroll (IntersectionObserver)
    │   ├── ThemeProvider.tsx     # Pengatur mode gelap/terang (Dark/Light)
    │   ├── MedicalRecordInput.tsx# Form catatan medis, karakter counter, tombol aksi
    │   ├── AnalysisResultView.tsx# Tampilan tab hasil, perbandingan komparasi, ekspor data
    │   └── DisclaimerNotice.tsx  # Banner peringatan keselamatan medis permanen
    │
    └── __tests__/
        ├── setup.ts              # Mock DOM, localStorage, & matchMedia
        ├── smoke.test.tsx        # Smoke test render komponen
        ├── navigation-theme.test.tsx # Pengujian navigasi & peralihan tema
        └── regressions.test.tsx  # Pengujian skenario regresi & error state
```

---

## ⚙️ Prasyarat Sistem

- **Node.js**: Versi `>= 20.10.0` (diuji pada v20.10.0, v22.x, dan v24.x).
- **npm**: Versi `>= 10.x`.
- **Backend API**: Layanan backend MediBrief yang aktif (port default: 4000).

---

## 🔑 Variabel Lingkungan (.env.local)

Buat file `.env.local` di dalam folder `frontend/`:

```bash
cp .env.example .env.local
```

Isi konfigurasi URL API:

```env
# URL publik atau lokal dari Backend API Express
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

> [!IMPORTANT]
> Jangan pernah memasukkan API Key Gemini atau DeepSeek pada konfigurasi Frontend. Seluruh kredensial AI dikelola secara terisolasi oleh Backend API.

---

## 💻 Instalasi & Menjalankan Aplikasi

### 1. Instalasi Dependensi
Jalankan di dalam folder `frontend/`:
```bash
npm install --install-links
```

### 2. Menjalankan di Mode Development
```bash
npm run dev
```
Akses aplikasi melalui peramban di: `http://localhost:3000`

### 3. Membangun Bundel Produksi (Build)
```bash
npm run build
npm run start
```

### 4. Pengecekan Lint & TypeScript
```bash
npm run lint
npm run typecheck
```

---

## 🚀 Panduan Deployment (Vercel)

Aplikasi frontend ini dioptimalkan untuk di-deploy ke platform serverless seperti **Vercel**:

1. Hubungkan repositori GitHub Anda ke dashboard Vercel.
2. Atur **Root Directory** ke folder: `frontend`.
3. Pada menu **Project Settings > Environment Variables**, tambahkan:
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://api.domain-backend-anda.com` (URL publik server backend Express Anda).
4. Klik **Deploy**.

---

## 🌓 Aksesibilitas & Tema (Dark/Light)

- **Pendeteksian Preferensi Sistem**: Pada kunjungan pertama, aplikasi secara otomatis menyesuaikan dengan preferensi perangkat pengguna (`prefers-color-scheme`).
- **Persistensi Pilihan**: Pilihan tema disimpan di `localStorage` dengan kunci `medibrief-theme`.
- **Motion Reduction**: Mendukung preferensi pengguna `prefers-reduced-motion: reduce` untuk menonaktifkan animasi transisi secara otomatis bagi pengguna yang sensitif terhadap gerakan visual.

---

## 🧪 Pengujian Otomatis (Frontend Testing)

Frontend dilengkapi dengan unit test berbasis **Vitest**, **React Testing Library**, dan **jsdom**:

```bash
npm test
```
*Mencakup pengujian rendering komponen input, tombol copy/ekspor, pergantian tema, pembatasan karakter masukan, dan pemformatan hasil.*
