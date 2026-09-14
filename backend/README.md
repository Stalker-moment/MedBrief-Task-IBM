# 🖥️ MediBrief Backend API

Layanan RESTful API mandiri untuk sistem **MediBrief** — Asisten Ringkasan Rekam Medis & Edukasi Pasien berbasis multi-provider AI (Google Gemini & DeepSeek). Dibangun menggunakan **Node.js (>= 20.10.0)**, **Express 5.2.1 Native ESM**, dan **TypeScript**.

---

## 📑 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Struktur Direktori](#-struktur-direktori)
3. [Prasyarat Sistem](#-prasyarat-sistem)
4. [Variabel Lingkungan (.env)](#-variabel-lingkungan-env)
5. [Instalasi & Menjalankan Servis](#-instalasi--menjalankan-servis)
6. [Dokumentasi API Endpoint](#-dokumentasi-api-endpoint)
7. [Arsitektur Keamanan & Prompt Engine](#-arsitektur-keamanan--prompt-engine)
8. [Pengujian Otomatis (Testing)](#-pengujian-otomatis-testing)
9. [Troubleshooting Khusus Windows Server](#-troubleshooting-khusus-windows-server)

---

## 🚀 Fitur Utama

- **Multi-Provider AI Resilience**: Terintegrasi langsung dengan SDK resmi `@google/genai` (Google Gemini) dan SDK `openai` (DeepSeek) dengan dukungan perbandingan output berdampingan (*side-by-side comparison*) dan mekanisme *fallback*.
- **Arsitektur 8-Layer Prompt Engine**: Lapisan prompt terisolasi untuk perlindungan injeksi prompt (*jailbreak defense*), pembatas data `<medical_record>`, kepatuhan grounded data (*zero hallucination*), dan validasi skema JSON ketat.
- **Privacy-Preserving Safe Logger**: Logger HTTP dan AI yang memfilter data rekam medis pasien, teks prompt mentah, dan API keys dari log server.
- **Keamanan Jaringan Berlapis**: Dilengkapi dengan `Helmet`, proteksi CORS dinamis/wildcard, dan `express-rate-limit` (40 permintaan per 15 menit).
- **Kompatibel Node.js 20 LTS**: Mendukung Node.js `>= 20.10.0` hingga Node 24.

---

## 📂 Struktur Direktori

```text
backend/
├── .env.example              # Template variabel lingkungan
├── .env                      # File konfigurasi lokal/server (jangan di-commit)
├── .npmrc                    # Konfigurasi npm (install-links=true)
├── package.json              # Definisi dependensi & script backend
├── tsconfig.json             # Konfigurasi TypeScript NodeNext
├── vitest.config.ts          # Konfigurasi pengujian Vitest
│
├── src/
│   ├── index.ts              # Server listener & graceful shutdown handler
│   ├── app.ts                # Inisialisasi Express, middleware keamanan, & rute
│   ├── config/
│   │   └── env.ts            # Validasi runtime environment variable dengan Zod
│   ├── middleware/
│   │   ├── request-id.ts     # Generator X-Request-ID & latency tracker
│   │   ├── logger.ts         # Privacy-safe logger (tanpa payload rekam medis)
│   │   ├── rate-limiter.ts   # Pembatas frekuensi request per IP
│   │   └── error-handler.ts  # Penanganan error global terpusat
│   ├── routes/
│   │   ├── health.route.ts   # Healthcheck endpoint (GET /health)
│   │   ├── providers.route.ts# Status ketersediaan provider AI (GET /api/providers)
│   │   └── analyze.route.ts  # Endpoint utama pemrosesan teks medis (POST /api/analyze)
│   └── services/
│       ├── orchestrator.service.ts # Manajemen alur pemanggilan model & fallback
│       ├── prompt/
│       │   ├── prompt-builder.ts   # 8-layer prompt assembly
│       │   └── schema-repair-prompt.ts # Prompt perbaikan otomatis skema JSON
│       └── providers/
│           ├── types.ts            # Kontrak interface AI provider
│           ├── gemini.provider.ts  # Integrasi SDK Google Gemini
│           └── deepseek.provider.ts# Integrasi DeepSeek via OpenAI API
│
├── tests/                    # Pengujian unit, skema, keamanan, & rute API
│   ├── api-routes.test.ts
│   ├── injection-defense.test.ts
│   ├── orchestrator.test.ts
│   ├── privacy-logging.test.ts
│   ├── prompt-layers.test.ts
│   └── schemas.test.ts
└── scripts/
    └── manual-provider-test.ts # Script uji langsung ke live provider AI
```

---

## ⚙️ Prasyarat Sistem

- **Node.js**: Versi `>= 20.10.0` (diuji pada v20.10.0, v22.x, dan v24.x).
- **npm**: Versi `>= 10.x`.
- **Koneksi Internet**: Untuk komunikasi ke endpoint Google Gemini & DeepSeek API.

---

## 🔑 Variabel Lingkungan (.env)

Buat file `.env` di dalam folder `backend/`:

```bash
cp .env.example .env
```

Contoh konfigurasi standar:

```env
PORT=4000
NODE_ENV=development
WEB_ORIGIN=http://localhost:3000

# Kunci API Google Gemini (Model: gemini-3.8-flash)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# Kunci API DeepSeek (Model: deepseek-v4-flash)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-v4-flash

# Pengaturan Fallback & Timeout
ALLOW_PROVIDER_FALLBACK=false
AI_TIMEOUT_MS=30000
```

---

## 💻 Instalasi & Menjalankan Servis

### 1. Instalasi Dependensi
Jalankan di dalam folder `backend/`:
```bash
npm install --install-links
```
*(Flag `--install-links` atau file `.npmrc` memastikan paket bersama `@medibrief/shared` di-copy secara fisik tanpa membuat symlink).*

### 2. Menjalankan di Mode Development
Menggunakan `tsx watch` untuk auto-reload saat kode diubah:
```bash
npm run dev
```
Server akan aktif di: `http://localhost:4000`

### 3. Menjalankan di Mode Production
Kompilasi TypeScript ke JavaScript murni (`dist/`), lalu jalankan dengan Node.js:
```bash
npm run build
npm run start
```

### 4. Pengecekan TypeScript (Typecheck)
```bash
npm run typecheck
```

---

## 📡 Dokumentasi API Endpoint

### 1. `GET /health`
Mengecek status kesehatan server.
- **Response `200 OK`**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-09-15T06:00:00.000Z",
    "uptime": 124.5
  }
  ```

### 2. `GET /api/providers`
Melihat daftar provider AI yang tersedia dan status konfigurasinya.
- **Response `200 OK`**:
  ```json
  {
    "gemini": { "available": true, "model": "gemini-3.8-flash" },
    "deepseek": { "available": true, "model": "deepseek-v4-flash" }
  }
  ```

### 3. `POST /api/analyze`
Menganalisis catatan rekam medis sintetis.
- **Header**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "recordText": "Pasien laki-laki 45 tahun datang dengan keluhan sakit kepala tengkuk sejak 4 hari...",
    "provider": "gemini",
    "targetLanguage": "id"
  }
  ```
  *Opsi provider*: `"gemini"`, `"deepseek"`, atau `"compare"`.  
  *Opsi targetLanguage*: `"id"` atau `"en"`.
- **Response `200 OK`**:
  Mengembalikan amplop response terstruktur berisi `clinicalSummary`, `patientExplanation`, `missingInformation`, `conflictingInformation`, `uncertainties`, `safetyNotes`, dan metadata latency.

---

## 🛡️ Arsitektur Keamanan & Prompt Engine

1. **Strict Input Boundaries**: Rekam medis dibatasi 20 – 20.000 karakter. Seluruh masukan diapit di dalam tag pembatas khusus `<medical_record>` dan dianggap sebagai *untrusted data*.
2. **Zero Hallucination Policy**: Model dilarang membuat diagnosis baru atau meresepkan obat tambahan yang tidak tercantum pada catatan sumber. Data yang tidak ada wajib bernilai `"Tidak disebutkan"`.
3. **Double Zod Validation**: Masukan divalidasi dengan Zod sebelum diproses, dan keluaran model divalidasi ulang dengan Zod sebelum dikirim ke klien.
4. **Data Isolation**: Log server tidak pernah menyimpan rekam medis teks mentah.

---

## 🧪 Pengujian Otomatis (Testing)

Backend dilengkapi dengan rangkaian unit & integration test komprehensif menggunakan **Vitest**:

```bash
# Menjalankan seluruh test
npm test

# Menjalankan test dengan laporan cakupan (coverage)
npm run test:coverage
```

---

## 🔧 Troubleshooting Khusus Windows Server

| Gejala Error | Penyebab | Solusi |
| :--- | :--- | :--- |
| `npm error EISDIR: illegal operation on a directory, symlink` | Drive D: (atau filesystem non-NTFS) menolak symlink antardirektori. | Pastikan file `.npmrc` memiliki `install-links=true`, lalu jalankan `npm install --install-links`. |
| `npm warn cleanup [Error: EPERM: operation not permitted]` | Folder `node_modules` sedang dikunci oleh proses Node atau Windows. | Jalankan `taskkill /F /IM node.exe` di CMD Administrator, lalu hapus `backend\node_modules` sebelum install ulang. |
| `'tsx' is not recognized` | `npm install` gagal di tengah jalan sehingga binary belum terpasang. | Bersihkan `node_modules` lalu jalankan `npm install --install-links`. |
