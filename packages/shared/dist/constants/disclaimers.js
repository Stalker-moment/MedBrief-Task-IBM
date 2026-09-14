/**
 * Permanent safety disclaimers for MediBrief.
 * MediBrief is an educational and documentation assistant, NOT a medical device or diagnostic system.
 */
export const DISCLAIMER_ID = 'PERINGATAN PENTING: MediBrief adalah asisten dokumentasi medis dan edukasi pasien, BUKAN pengganti dokter atau tenaga medis profesional. Sistem ini tidak memberikan diagnosis medis, rekomendasi pengobatan, atau perubahan dosis. Selalu konsultasikan kondisi kesehatan Anda dengan dokter atau profesional kesehatan yang berkualifikasi.';
export const DISCLAIMER_EN = 'IMPORTANT NOTICE: MediBrief is a medical documentation and patient-education assistant, NOT a substitute for a doctor or professional healthcare provider. This system does not provide medical diagnoses, treatment recommendations, or dosage modifications. Always consult qualified healthcare professionals for medical conditions.';
export const NOT_MENTIONED_ID = 'Tidak disebutkan';
export const NOT_MENTIONED_EN = 'Not mentioned';
export function getDisclaimer(language) {
    return language === 'en' ? DISCLAIMER_EN : DISCLAIMER_ID;
}
export function getNotMentionedText(language) {
    return language === 'en' ? NOT_MENTIONED_EN : NOT_MENTIONED_ID;
}
//# sourceMappingURL=disclaimers.js.map