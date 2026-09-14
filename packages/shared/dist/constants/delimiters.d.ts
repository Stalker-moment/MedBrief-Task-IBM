/**
 * Secure delimiters for untrusted medical record data.
 * Used by prompt layering to demarcate data from instructions.
 */
export declare const MEDICAL_RECORD_START_TAG = "<medical_record>";
export declare const MEDICAL_RECORD_END_TAG = "</medical_record>";
/**
 * Sanitizes input text to prevent breaking out of delimiter boundaries.
 */
export declare function wrapInRecordDelimiters(recordText: string): string;
//# sourceMappingURL=delimiters.d.ts.map