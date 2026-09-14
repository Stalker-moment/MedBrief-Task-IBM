# 📦 MediBrief Shared Package (`@medibrief/shared`)

Paket pustaka bersama yang memuat kontrak data, skema validasi Zod, dan konstanta yang digunakan secara konsisten oleh **Backend API** dan **Frontend Web**.

---

## 📑 Daftar Isi

1. [Fungsi & Cakupan](#-fungsi--cakupan)
2. [Struktur Direktori](#-struktur-direktori)
3. [Ekspor Utama](#-ekspor-utama)
4. [Kompilasi & Build](#-kompilasi--build)

---

## 🎯 Fungsi & Cakupan

Paket ini menjamin integritas kontrak (*single source of truth*) antara frontend dan backend:
- Menghindari ketidakcocokan tipe (*type mismatch*) antara respon API dan tampilan UI.
- Memvalidasi format request dan response dengan **Zod**.
- Menyediakan teks disclaimer medis dan contoh rekam medis sintetis yang seragam.

---

## 📂 Struktur Direktori

```text
packages/shared/
├── package.json          # Definisi nama @medibrief/shared & exports
├── tsconfig.json         # Kompilasi TypeScript declaration & maps
├── dist/                 # Artefak terkompilasi (.js, .d.ts, .map)
└── src/
    ├── index.ts          # Entry point ekspor publik
    ├── schemas/
    │   └── analyze.schema.ts # Skema Zod untuk validasi request & response AI
    └── constants/
        ├── delimiters.ts     # Tag pembatas injeksi prompt (<medical_record>)
        ├── disclaimers.ts    # Pernyataan keselamatan resmi ID & EN
        └── synthetic-samples.ts # Data uji rekam medis sintetis
```

---

## 🔑 Ekspor Utama

```typescript
import {
  // Skema Zod & Types
  RecordAnalyzeRequestSchema,
  RecordAnalyzeResponseSchema,
  ClinicalSummarySchema,
  PatientExplanationSchema,
  RecordAnalyzeRequest,
  RecordAnalyzeResponse,
  LanguageOption,
  ProviderOption,

  // Konstanta
  MEDICAL_RECORD_START_TAG,
  MEDICAL_RECORD_END_TAG,
  MEDICAL_DISCLAIMER_ID,
  MEDICAL_DISCLAIMER_EN,
  SYNTHETIC_SAMPLES
} from '@medibrief/shared';
```

---

## ⚙️ Kompilasi & Build

Kompilasi TypeScript ke format ESM dan file `.d.ts`:

```bash
# Dari root monorepo
npm run build --workspace=@medibrief/shared

# Atau dari direktori ini
npm run build
```
*(Hasil kompilasi disimpan di folder `dist/` dan telah ditrack di Git agar dapat dikonsumsi langsung).*
