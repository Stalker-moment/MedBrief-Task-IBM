import { StructuredAnalysisResult } from '@medibrief/shared';

export const MOCK_STRUCTURED_RESULT: StructuredAnalysisResult = {
  clinicalSummary: {
    chiefComplaint: 'Sakit kepala bagian belakang sejak 4 hari lalu',
    relevantHistory: 'Hipertensi 3 tahun, Diabetes Melitus tipe 2 selama 5 tahun, riwayat ketidakpatuhan obat',
    medications: 'Metformin 500 mg 2x1, Amlodipine 10 mg 1x1',
    allergies: 'Alergi Amoxicillin (ruam kemerahan gatal)',
    examinationFindings: 'TD 165/95 mmHg, Nadi 84x/m, RR 19x/m, Suhu 36.7°C, IMT 27.9, edema pretibial minimal',
    laboratoryFindings: 'GDS 245 mg/dL, HbA1c 8.8%, Ureum 32 mg/dL, Kreatinin 1.1 mg/dL, Kolesterol 228 mg/dL',
    assessmentFromSource: 'Hipertensi Stage 2 tidak terkontrol, DM Tipe 2 tidak terkontrol, Dislipidemia, Nefropati diabetik awal',
    planFromSource: 'Lanjut Amlodipine 10mg, tambah Candesartan 8mg, Metformin 800mg 2x1, Atorvastatin 20mg 1x1',
    followUpFromSource: 'Kontrol 2 minggu lagi di Poli Penyakit Dalam',
  },
  patientExplanation: {
    overview: 'Tekanan darah dan kadar gula darah Anda saat ini sedang tinggi karena obat sebelumnya tidak diminum secara teratur.',
    medicinesMentioned: 'Dokter meresepkan Amlodipine (pagi), Candesartan (malam), Metformin bersama makan, dan Atorvastatin (malam).',
    followUp: 'Penting untuk meminum semua obat tepat waktu, mengatur pola makan rendah garam/gula, dan kontrol ulang 2 minggu lagi.',
    questionsForHealthcareProfessional: [
      'Bagaimana cara terbaik menjadwalkan konsumsi obat agar tidak terlupa?',
      'Apakah ada pantangan makanan khusus untuk membantu menurunkan gula darah dan kolesterol?',
      'Kapan saya harus segera ke dokter jika sakit kepala tidak kunjung membaik?',
    ],
  },
  missingInformation: [
    'Tidak disebutkan riwayat merokok atau konsumsi alkohol pasien',
    'Tidak disebutkan data riwayat penyakit dalam keluarga',
  ],
  conflictingInformation: [],
  uncertainties: [
    'Perlu konfirmasi apakah edema pretibial berkaitan dengan fungsi ginjal atau efek samping obat',
  ],
  safetyNotes: [
    'PASIEN MEMILIKI RIWAYAT ALERGI AMOXICILLIN - hindari penggunaan antibiotik golongan penisilin',
    'Tekanan darah 165/95 mmHg tergolong tinggi, segera cari pertolongan darurat bila muncul nyeri dada atau pandangan kabur',
  ],
};
