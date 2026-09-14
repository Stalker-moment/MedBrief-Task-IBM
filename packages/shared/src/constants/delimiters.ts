/**
 * Secure delimiters for untrusted medical record data.
 * Used by prompt layering to demarcate data from instructions.
 */
export const MEDICAL_RECORD_START_TAG = '<medical_record>';
export const MEDICAL_RECORD_END_TAG = '</medical_record>';

/**
 * Sanitizes input text to prevent breaking out of delimiter boundaries.
 */
export function wrapInRecordDelimiters(recordText: string): string {
  // Strip or neutralize any user-supplied closing tags to prevent delimiter escape
  const sanitized = recordText
    .replaceAll('</medical_record>', '&lt;/medical_record&gt;')
    .replaceAll('<medical_record>', '&lt;medical_record&gt;');

  return `${MEDICAL_RECORD_START_TAG}\n${sanitized}\n${MEDICAL_RECORD_END_TAG}`;
}
