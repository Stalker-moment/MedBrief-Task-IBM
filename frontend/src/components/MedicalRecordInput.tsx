'use client';

import React, { useState } from 'react';
import {
  AudienceOption,
  LanguageOption,
  ProviderOption,
  SYNTHETIC_SAMPLES,
} from '@medibrief/shared';
import {
  Sparkles,
  RotateCcw,
  FileCheck,
  ShieldAlert,
  Cpu,
  Users,
  Globe,
  Loader2,
  XCircle,
  FormInput,
  FileText,
  HeartPulse,
  Pill,
  AlertOctagon,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface AnalyzeFormValues {
  recordText: string;
  provider: ProviderOption;
  audience: AudienceOption;
  language: LanguageOption;
}

interface MedicalRecordInputProps {
  onSubmit: (values: AnalyzeFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

// Guided Form State Interface
interface GuidedFormData {
  patientAge: string;
  patientGender: string;
  chiefComplaint: string;
  duration: string;
  symptomTags: string[];
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  bloodPressure: string;
  bloodSugar: string;
  bodyTemp: string;
  otherLabs: string;
  doctorNotes: string;
}

const INITIAL_GUIDED_FORM: GuidedFormData = {
  patientAge: '',
  patientGender: '',
  chiefComplaint: '',
  duration: '',
  symptomTags: [],
  medicalHistory: '',
  currentMedications: '',
  allergies: '',
  bloodPressure: '',
  bloodSugar: '',
  bodyTemp: '',
  otherLabs: '',
  doctorNotes: '',
};

const COMMON_SYMPTOM_TAGS = [
  'Pusing / Sakit Kepala',
  'Demam / Panas',
  'Mual / Muntah',
  'Sesak Napas',
  'Nyeri Dada',
  'Lemas / Cepat Lelah',
  'Batuk Berdahak',
  'Diare / BAB Cair',
  'Nyeri Ulu Hati',
  'Kaki Bengkak',
];

export function MedicalRecordInput({ onSubmit, isLoading, onCancel }: MedicalRecordInputProps) {
  const [inputMode, setInputMode] = useState<'guided' | 'raw'>('guided');
  const [guidedForm, setGuidedForm] = useState<GuidedFormData>(INITIAL_GUIDED_FORM);
  const [rawRecordText, setRawRecordText] = useState('');
  const [provider, setProvider] = useState<ProviderOption>('gemini');
  const [audience, setAudience] = useState<AudienceOption>('both');
  const [language, setLanguage] = useState<LanguageOption>('id');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [showAssembledPreview, setShowAssembledPreview] = useState(false);

  // Helper to assemble guided form into clean standard clinical text
  const assembleGuidedText = (data: GuidedFormData): string => {
    const parts: string[] = [];
    parts.push('[CATATAN MEDIS RAWAT JALAN - FORM TERPANDU SINTETIS]');

    // Demographics
    const demo: string[] = [];
    if (data.patientAge.trim()) demo.push(`Usia: ${data.patientAge.trim()}`);
    if (data.patientGender.trim()) demo.push(`Jenis Kelamin: ${data.patientGender.trim()}`);
    if (demo.length > 0) parts.push(`Pasien: ${demo.join(', ')}`);

    // Anamnesis / Complaints
    parts.push('\nANAMNESIS:');
    let complaintText = data.chiefComplaint.trim() || 'Tidak disebutkan keluhan spesifik';
    if (data.symptomTags.length > 0) {
      complaintText += ` (Gejala menyertai: ${data.symptomTags.join(', ')})`;
    }
    parts.push(`Keluhan Utama: ${complaintText}`);
    if (data.duration.trim()) {
      parts.push(`Lama Keluhan: ${data.duration.trim()}`);
    }

    // Medical History
    if (data.medicalHistory.trim()) {
      parts.push(`Riwayat Penyakit Terdahulu: ${data.medicalHistory.trim()}`);
    }

    // Allergies (Very important!)
    const allergyVal = data.allergies.trim() || 'Tidak disebutkan';
    parts.push(`Riwayat Alergi: ${allergyVal}`);

    // Medications
    if (data.currentMedications.trim()) {
      parts.push(`Riwayat Pengobatan / Obat Rutin: ${data.currentMedications.trim()}`);
    }

    // Physical Exam & Labs
    const vitals: string[] = [];
    if (data.bloodPressure.trim()) vitals.push(`TD: ${data.bloodPressure.trim()}`);
    if (data.bloodSugar.trim()) vitals.push(`Gula Darah: ${data.bloodSugar.trim()}`);
    if (data.bodyTemp.trim()) vitals.push(`Suhu: ${data.bodyTemp.trim()}`);

    if (vitals.length > 0 || data.otherLabs.trim()) {
      parts.push('\nPEMERIKSAAN FISIK & PENUNJANG:');
      if (vitals.length > 0) parts.push(`Tanda Vital: ${vitals.join(', ')}`);
      if (data.otherLabs.trim()) parts.push(`Hasil Lab / Temuan Lain: ${data.otherLabs.trim()}`);
    }

    // Assessment / Doctor Notes
    if (data.doctorNotes.trim()) {
      parts.push('\nCATATAN DOKTER / ANJURAN:');
      parts.push(data.doctorNotes.trim());
    }

    return parts.join('\n');
  };

  // Determine current effective text based on active mode
  const effectiveRecordText = inputMode === 'guided'
    ? assembleGuidedText(guidedForm)
    : rawRecordText;

  const charCount = effectiveRecordText.length;
  const isGuidedEmpty = !guidedForm.chiefComplaint.trim() && guidedForm.symptomTags.length === 0;
  const isValidToSubmit = inputMode === 'guided'
    ? !isGuidedEmpty && charCount >= 20 && charCount <= 20000
    : rawRecordText.trim().length >= 20 && charCount <= 20000;

  // Preset loaders for Guided Form
  const loadGuidedPreset = (presetType: 'ht-dm' | 'pediatric' | 'dyspepsia') => {
    if (presetType === 'ht-dm') {
      setGuidedForm({
        patientAge: '58 tahun',
        patientGender: 'Laki-laki',
        chiefComplaint: 'Sakit kepala bagian belakang dan tengkuk kaku sejak 4 hari lalu',
        duration: '4 hari, terasa lebih berat di pagi hari saat bangun tidur',
        symptomTags: ['Pusing / Sakit Kepala', 'Lemas / Cepat Lelah'],
        medicalHistory: 'Diabetes Melitus tipe 2 sejak 5 tahun, Hipertensi sejak 3 tahun lalu',
        currentMedications: 'Metformin 500mg 2x1 (sering lupa), Amlodipine 10mg 1x1 (kadang terlewat)',
        allergies: 'Alergi antibiotik Amoxicillin (kulit bentol kemerahan dan gatal)',
        bloodPressure: '165/95 mmHg',
        bloodSugar: 'GDS: 245 mg/dL, HbA1c: 8.8%',
        bodyTemp: '36.7 °C',
        otherLabs: 'Kolesterol total 228 mg/dL, mikroalbuminuria (+1)',
        doctorNotes: 'Evaluasi kepatuhan obat antihipertensi dan antidiabetik oral. Pertimbangkan tambah Candesartan.',
      });
    } else if (presetType === 'pediatric') {
      setGuidedForm({
        patientAge: '4 tahun',
        patientGender: 'Laki-laki',
        chiefComplaint: 'Demam dan diare cair 4-5 kali sehari sejak kemarin siang',
        duration: '1 hari, anak tampak rewel dan haus terus menerus',
        symptomTags: ['Demam / Panas', 'Diare / BAB Cair', 'Lemas / Cepat Lelah'],
        medicalHistory: 'Riwayat reaksi alergi anafilaktoid terhadap obat sulfonamida',
        currentMedications: 'Paracetamol sirup 120mg/5ml bila demam',
        allergies: 'Alergi sulfonamida / sulfa (kontradiksi triase)',
        bloodPressure: '',
        bloodSugar: 'Tidak dilakukan tes gula',
        bodyTemp: '36.6 °C di klinik (sempat 39.2 °C di rumah)',
        otherLabs: 'Nadi 110x/m, RR 24x/m. Turgor kulit kembali lambat 2 detik, bibir kering (dehidrasi ringan-sedang)',
        doctorNotes: 'Berikan oralit tiap kali BAB cair dan sirup Zinc 20mg selama 10 hari.',
      });
    } else if (presetType === 'dyspepsia') {
      setGuidedForm({
        patientAge: '42 tahun',
        patientGender: 'Perempuan',
        chiefComplaint: 'Nyeri ulu hati perih terasa panas naik ke kerongkongan, perut kembung',
        duration: '3 hari terakhir, memburuk setelah minum kopi dan telat makan',
        symptomTags: ['Nyeri Ulu Hati', 'Mual / Muntah'],
        medicalHistory: 'Riwayat sakit maag / gastritis berulang',
        currentMedications: 'Antasida sirup saat kambuh',
        allergies: 'Tidak ada alergi obat',
        bloodPressure: '120/80 mmHg',
        bloodSugar: 'GDS: 110 mg/dL',
        bodyTemp: '36.5 °C',
        otherLabs: 'Bising usus normal, nyeri tekan epigastrium (+)',
        doctorNotes: 'Anjurkan makan teratur porsi kecil sering, hindari pedas/asam, pertimbangkan Omeprazole.',
      });
    }
    setInputMode('guided');
  };

  // Toggle a symptom tag in guided form
  const toggleSymptomTag = (tag: string) => {
    setGuidedForm((prev) => {
      const exists = prev.symptomTags.includes(tag);
      return {
        ...prev,
        symptomTags: exists
          ? prev.symptomTags.filter((t) => t !== tag)
          : [...prev.symptomTags, tag],
      };
    });
  };

  // Raw Sample Loader
  const handleLoadRawSample = (sampleId?: string) => {
    const list = Array.isArray(SYNTHETIC_SAMPLES) && SYNTHETIC_SAMPLES.length > 0 ? SYNTHETIC_SAMPLES : [];
    const target = list.find((s) => s.id === sampleId) || list[0];
    if (target) {
      setRawRecordText(target.recordText);
      setSelectedSampleId(target.id);
    }
  };

  const handleClearAll = () => {
    setGuidedForm(INITIAL_GUIDED_FORM);
    setRawRecordText('');
    setSelectedSampleId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidToSubmit || isLoading) return;

    onSubmit({
      recordText: effectiveRecordText,
      provider,
      audience,
      language,
    });
  };

  return (
    <section
      id="workspace"
      aria-labelledby="input-heading"
      className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-8 scroll-mt-24 transition-all"
    >
      {/* Privacy Guard Notice */}
      <div className="mb-6 p-4 bg-emerald-50/90 dark:bg-emerald-900/90 border border-emerald-200 dark:border-emerald-700 rounded-2xl flex items-start gap-3.5 text-xs text-emerald-950 dark:text-emerald-100 shadow-xs">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-emerald-700 dark:text-emerald-300 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="font-bold block text-emerald-950 dark:text-emerald-100 mb-0.5">PERHATIAN KEAMANAN & PRIVASI DATA:</strong>
          Sistem ini hanya memproses <strong>data sintetis (fiktif)</strong> atau catatan yang telah di-anonimkan sepenuhnya. Jangan memasukkan identitas asli, NIK, alamat rumah, atau data rahasia riil.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isLoading} className="min-w-0 space-y-6">
        <legend className="sr-only">Catatan dan pengaturan analisis</legend>
        {/* Header & Mode Switcher Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="input-heading" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Pusat Analisis Rekam Medis
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-medisa-mint dark:bg-teal-950 text-medisa-dark dark:text-teal-200 font-bold">
                Smart Input
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pilih mode pengisian yang paling nyaman untuk Anda di bawah ini:
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-2 w-full lg:w-auto p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 gap-1.5 self-start sm:self-auto shadow-inner">
            <button
              type="button"
              aria-pressed={inputMode === 'guided'}
              onClick={() => setInputMode('guided')}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-center cursor-pointer border ${
                inputMode === 'guided'
                  ? 'bg-white dark:bg-slate-800 text-medisa-teal dark:text-teal-300 shadow-xs border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <FormInput className={`w-4 h-4 shrink-0 transition-colors ${inputMode === 'guided' ? 'text-medisa-teal dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'}`} aria-hidden="true" />
              <span className="leading-tight text-center sm:text-left">Form Terpandu (Orang Awam)</span>
            </button>

            <button
              type="button"
              aria-pressed={inputMode === 'raw'}
              onClick={() => setInputMode('raw')}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-center cursor-pointer border ${
                inputMode === 'raw'
                  ? 'bg-white dark:bg-slate-800 text-medisa-teal dark:text-teal-300 shadow-xs border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 border-transparent'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 transition-colors ${inputMode === 'raw' ? 'text-medisa-teal dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'}`} aria-hidden="true" />
              <span className="leading-tight text-center sm:text-left">Catatan Bebas (Dokter / Nakes)</span>
            </button>
          </div>
        </div>

        {/* -------------------- MODE 1: GUIDED FORM TEMPLATE -------------------- */}
        {inputMode === 'guided' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Presets Bar */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" />
                <span>Isi Cepat Contoh Kasus:</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => loadGuidedPreset('ht-dm')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-medisa-teal text-slate-700 dark:text-slate-300 hover:text-medisa-teal dark:hover:text-teal-300 transition shadow-2xs"
                >
                  🩺 Tensi & Gula Darah
                </button>
                <button
                  type="button"
                  onClick={() => loadGuidedPreset('pediatric')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-medisa-teal text-slate-700 dark:text-slate-300 hover:text-medisa-teal dark:hover:text-teal-300 transition shadow-2xs"
                >
                  👶 Anak Demam & Diare
                </button>
                <button
                  type="button"
                  onClick={() => loadGuidedPreset('dyspepsia')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-medisa-teal text-slate-700 dark:text-slate-300 hover:text-medisa-teal dark:hover:text-teal-300 transition shadow-2xs"
                >
                  🍵 Sakit Maag / Lambung
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900 transition"
                  title="Kosongkan form"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 1: Profil Pasien & Keluhan Utama */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                <HeartPulse className="w-4 h-4 text-medisa-teal dark:text-teal-300" />
                <span>1. Profil Pasien & Keluhan Utama</span>
                <span className="text-xs text-rose-500 dark:text-rose-400 font-normal">*Wajib diisi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="guided-patientAge" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Usia Pasien (Anonim)
                  </label>
                  <input id="guided-patientAge"
                    type="text"
                    value={guidedForm.patientAge}
                    onChange={(e) => setGuidedForm({ ...guidedForm, patientAge: e.target.value })}
                    placeholder="Contoh: 58 tahun / 4 tahun"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>

                <div>
                  <label htmlFor="guided-patientGender" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select id="guided-patientGender"
                    value={guidedForm.patientGender}
                    onChange={(e) => setGuidedForm({ ...guidedForm, patientGender: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal bg-white dark:bg-slate-900"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="guided-duration" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lama Keluhan Dirasakan
                  </label>
                  <input id="guided-duration"
                    type="text"
                    value={guidedForm.duration}
                    onChange={(e) => setGuidedForm({ ...guidedForm, duration: e.target.value })}
                    placeholder="Contoh: 3 hari, memberat di pagi hari"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guided-chiefComplaint" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Apa Keluhan atau Gejala yang Paling Anda Rasakan?
                </label>
                <textarea id="guided-chiefComplaint"
                  rows={2}
                  value={guidedForm.chiefComplaint}
                  onChange={(e) => setGuidedForm({ ...guidedForm, chiefComplaint: e.target.value })}
                  placeholder="Ceritakan dengan bahasa bebas sehari-hari. Contoh: Sakit kepala bagian belakang, leher terasa kaku dan badan meriang..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal leading-relaxed"
                />
              </div>

              {/* Quick Symptom Tags */}
              <div>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  💡 Klik untuk menambahkan gejala umum secara instan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SYMPTOM_TAGS.map((tag) => {
                    const isSelected = guidedForm.symptomTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleSymptomTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-medisa-teal text-white border-medisa-teal font-bold shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-medium'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Riwayat Penyakit, Obat, dan Alergi */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Pill className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                <span>2. Riwayat Kesehatan, Obat, & Alergi</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guided-medicalHistory" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Riwayat Penyakit Terdahulu
                  </label>
                  <input id="guided-medicalHistory"
                    type="text"
                    value={guidedForm.medicalHistory}
                    onChange={(e) => setGuidedForm({ ...guidedForm, medicalHistory: e.target.value })}
                    placeholder="Contoh: Darah tinggi 3 tahun, Diabetes 5 tahun, Asam lambung"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>

                <div>
                  <label htmlFor="guided-currentMedications" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Obat yang Sedang Diminum
                  </label>
                  <input id="guided-currentMedications"
                    type="text"
                    value={guidedForm.currentMedications}
                    onChange={(e) => setGuidedForm({ ...guidedForm, currentMedications: e.target.value })}
                    placeholder="Contoh: Amlodipine 10mg pagi, Metformin 500mg 2x1"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>
              </div>

              {/* Special Allergy Field */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-900/70 border border-amber-200 dark:border-amber-700">
                <label htmlFor="guided-allergies" className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-100 mb-1">
                  <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                  <span>Riwayat Alergi Obat / Makanan (Sangat Penting untuk Keselamatan):</span>
                </label>
                <input id="guided-allergies"
                  type="text"
                  value={guidedForm.allergies}
                  onChange={(e) => setGuidedForm({ ...guidedForm, allergies: e.target.value })}
                  placeholder="Contoh: Alergi Amoxicillin (timbul ruam gatal), atau ketik 'Tidak ada alergi'"
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Step 3: Tanda Vital & Hasil Lab (Opsional) */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Stethoscope className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                <span>3. Tanda Vital & Hasil Lab Mandiri (Opsional)</span>
                <span className="text-xs text-slate-400 font-normal">Boleh dikosongkan jika tidak ada</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="guided-bloodPressure" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tekanan Darah (TD)
                  </label>
                  <input id="guided-bloodPressure"
                    type="text"
                    value={guidedForm.bloodPressure}
                    onChange={(e) => setGuidedForm({ ...guidedForm, bloodPressure: e.target.value })}
                    placeholder="Contoh: 165/95 mmHg"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>

                <div>
                  <label htmlFor="guided-bloodSugar" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gula Darah (GDS / GDP)
                  </label>
                  <input id="guided-bloodSugar"
                    type="text"
                    value={guidedForm.bloodSugar}
                    onChange={(e) => setGuidedForm({ ...guidedForm, bloodSugar: e.target.value })}
                    placeholder="Contoh: GDS 245 mg/dL"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>

                <div>
                  <label htmlFor="guided-bodyTemp" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Tubuh
                  </label>
                  <input id="guided-bodyTemp"
                    type="text"
                    value={guidedForm.bodyTemp}
                    onChange={(e) => setGuidedForm({ ...guidedForm, bodyTemp: e.target.value })}
                    placeholder="Contoh: 36.8 °C / 38.5 °C"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guided-otherLabs" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hasil Lab / Temuan Lainnya</label>
                <textarea id="guided-otherLabs" rows={2} value={guidedForm.otherLabs} onChange={(e) => setGuidedForm({ ...guidedForm, otherLabs: e.target.value })} placeholder="Isi hasil pemeriksaan yang tercatat, jika ada" className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label htmlFor="guided-doctorNotes" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan atau Anjuran Dokter
                </label>
                <input id="guided-doctorNotes"
                  type="text"
                  value={guidedForm.doctorNotes}
                  onChange={(e) => setGuidedForm({ ...guidedForm, doctorNotes: e.target.value })}
                  placeholder="Contoh: Dokter menganjurkan cek kolesterol dan kontrol ulang 2 minggu lagi"
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medisa-teal"
                />
              </div>
            </div>

            {/* Live Assembly Preview Accordion */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/70 overflow-hidden">
              <button
                type="button"
                aria-expanded={showAssembledPreview}
                onClick={() => setShowAssembledPreview(!showAssembledPreview)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-medisa-teal dark:text-teal-300" />
                  <span>Lihat Format Catatan Medis yang Disusun Otomatis</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {charCount} karakter
                  </span>
                </div>
                {showAssembledPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAssembledPreview && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {effectiveRecordText}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- MODE 2: RAW MEDICAL NOTE TEXTAREA -------------------- */}
        {inputMode === 'raw' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Action Bar for Raw Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" />
                <span>Mode Catatan Medis Lengkap / Transkrip Rawat Jalan</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  aria-label="Pilih Contoh Rekam Medis Sintetis"
                  value={selectedSampleId}
                  onChange={(e) => handleLoadRawSample(e.target.value)}
                  disabled={isLoading}
                  className="text-xs bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-medisa-teal focus:outline-none transition cursor-pointer"
                >
                  <option value="" disabled>
                    💡 Muat Contoh Sintetis...
                  </option>
                  {(SYNTHETIC_SAMPLES || []).map((sample) => (
                    <option key={sample.id} value={sample.id}>
                      {sample.title}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleLoadRawSample()}
                  disabled={isLoading}
                  className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-100 font-medium rounded-lg border border-teal-200 dark:border-teal-700 transition"
                >
                  <FileCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Contoh Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRawRecordText(''); setSelectedSampleId(''); }}
                  disabled={isLoading || !rawRecordText}
                  className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900 font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Kosongkan</span>
                </button>
              </div>
            </div>

            <textarea
              id="medical-note-input"
              aria-label="Isi Catatan Rekam Medis"
              value={rawRecordText}
              onChange={(e) => { setRawRecordText(e.target.value); setSelectedSampleId(''); }}
              aria-invalid={rawRecordText.length > 20000}
              disabled={isLoading}
              rows={11}
              placeholder="Tempelkan atau ketik catatan rekam medis lengkap di sini...&#10;&#10;Format yang didukung: Anamnesis keluhan, riwayat penyakit, pemeriksaan fisik, hasil lab, diagnosis dokter, dan rencana terapi."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 font-mono text-xs sm:text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-medisa-teal bg-slate-50/40 dark:bg-slate-900/40"
            />

            <div className="flex flex-wrap gap-2 items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
              <span>{rawRecordText.length > 20000 ? 'Batas karakter terlampaui' : rawRecordText.trim().length < 20 ? `Minimal 20 karakter (saat ini: ${rawRecordText.length})` : 'Panjang teks memenuhi syarat'}</span>
              <span className="font-mono">{rawRecordText.length.toLocaleString('id-ID')} / 20.000 karakter</span>
            </div>
          </div>
        )}

        {/* -------------------- AI CONFIGURATION BAR -------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Provider Selector */}
          <div>
            <label htmlFor="provider-select" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <Cpu className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" aria-hidden="true" />
              <span>Model Kecerdasan Buatan (AI)</span>
            </label>
            <select
              id="provider-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value as ProviderOption)}
              disabled={isLoading}
              className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medisa-teal font-medium"
            >
              <option value="gemini">Google Gemini (Default)</option>
              <option value="deepseek">DeepSeek</option>
              <option value="compare">Bandingkan Gemini & DeepSeek</option>
            </select>
          </div>

          {/* Audience Selector */}
          <div>
            <label htmlFor="audience-select" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <Users className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" aria-hidden="true" />
              <span>Target Audiens Output</span>
            </label>
            <select
              id="audience-select"
              value={audience}
              onChange={(e) => setAudience(e.target.value as AudienceOption)}
              disabled={isLoading}
              className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medisa-teal font-medium"
            >
              <option value="both">Keduanya (Klinis & Pasien)</option>
              <option value="patient">Hanya Pasien (Bahasa Ramah Awam)</option>
              <option value="clinical">Hanya Klinis (Dokter / Nakes)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div>
            <label htmlFor="language-select" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-medisa-teal dark:text-teal-300" aria-hidden="true" />
              <span>Bahasa Ringkasan</span>
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageOption)}
              disabled={isLoading}
              className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medisa-teal font-medium"
            >
              <option value="id">Bahasa Indonesia (Utama)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        </fieldset>
        {charCount > 20000 && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">Catatan melebihi batas 20.000 karakter. Kurangi teks sebelum menganalisis.</p>}
        {/* -------------------- SUBMIT ACTIONS -------------------- */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 hidden sm:block">
            {inputMode === 'guided' ? '💡 Data akan dirangkum otomatis secara klinis' : '💡 Pastikan tidak ada data identitas asli (PII)'}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto justify-end">
            {isLoading && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-full transition"
              >
                <XCircle className="w-4 h-4" aria-hidden="true" />
                <span>Batalkan</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!isValidToSubmit || isLoading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-300 ${
                !isValidToSubmit || isLoading
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-medisa-teal via-teal-700 to-medisa-dark hover:scale-[1.02] shadow-medisa-teal/25 cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Menganalisis Rekam Medis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-medisa-accent" aria-hidden="true" />
                  <span>Analisis Rekam Medis Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
