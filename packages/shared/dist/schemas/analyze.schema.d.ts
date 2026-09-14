import { z } from 'zod';
export declare const ProviderOptionSchema: z.ZodEnum<["gemini", "deepseek", "compare"]>;
export type ProviderOption = z.infer<typeof ProviderOptionSchema>;
export declare const SingleProviderSchema: z.ZodEnum<["gemini", "deepseek"]>;
export type SingleProvider = z.infer<typeof SingleProviderSchema>;
export declare const AudienceOptionSchema: z.ZodEnum<["clinical", "patient", "both"]>;
export type AudienceOption = z.infer<typeof AudienceOptionSchema>;
export declare const LanguageOptionSchema: z.ZodEnum<["id", "en"]>;
export type LanguageOption = z.infer<typeof LanguageOptionSchema>;
/**
 * Request payload validation schema for POST /api/v1/medical-records/analyze
 */
export declare const RecordAnalyzeRequestSchema: z.ZodObject<{
    recordText: z.ZodEffects<z.ZodString, string, string>;
    provider: z.ZodDefault<z.ZodEnum<["gemini", "deepseek", "compare"]>>;
    audience: z.ZodDefault<z.ZodEnum<["clinical", "patient", "both"]>>;
    language: z.ZodDefault<z.ZodEnum<["id", "en"]>>;
}, "strip", z.ZodTypeAny, {
    recordText: string;
    provider: "gemini" | "deepseek" | "compare";
    audience: "clinical" | "patient" | "both";
    language: "id" | "en";
}, {
    recordText: string;
    provider?: "gemini" | "deepseek" | "compare" | undefined;
    audience?: "clinical" | "patient" | "both" | undefined;
    language?: "id" | "en" | undefined;
}>;
export type RecordAnalyzeRequest = z.infer<typeof RecordAnalyzeRequestSchema>;
/**
 * Structured Clinical Summary Schema
 */
export declare const ClinicalSummarySchema: z.ZodObject<{
    chiefComplaint: z.ZodString;
    relevantHistory: z.ZodString;
    medications: z.ZodString;
    allergies: z.ZodString;
    examinationFindings: z.ZodString;
    laboratoryFindings: z.ZodString;
    assessmentFromSource: z.ZodString;
    planFromSource: z.ZodString;
    followUpFromSource: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chiefComplaint: string;
    relevantHistory: string;
    medications: string;
    allergies: string;
    examinationFindings: string;
    laboratoryFindings: string;
    assessmentFromSource: string;
    planFromSource: string;
    followUpFromSource: string;
}, {
    chiefComplaint: string;
    relevantHistory: string;
    medications: string;
    allergies: string;
    examinationFindings: string;
    laboratoryFindings: string;
    assessmentFromSource: string;
    planFromSource: string;
    followUpFromSource: string;
}>;
export type ClinicalSummary = z.infer<typeof ClinicalSummarySchema>;
/**
 * Patient-friendly Explanation Schema
 */
export declare const PatientExplanationSchema: z.ZodObject<{
    overview: z.ZodString;
    medicinesMentioned: z.ZodString;
    followUp: z.ZodString;
    questionsForHealthcareProfessional: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    overview: string;
    medicinesMentioned: string;
    followUp: string;
    questionsForHealthcareProfessional: string[];
}, {
    overview: string;
    medicinesMentioned: string;
    followUp: string;
    questionsForHealthcareProfessional: string[];
}>;
export type PatientExplanation = z.infer<typeof PatientExplanationSchema>;
/**
 * Complete Structured Analysis Result Schema produced by AI Providers
 */
export declare const StructuredAnalysisResultSchema: z.ZodObject<{
    clinicalSummary: z.ZodObject<{
        chiefComplaint: z.ZodString;
        relevantHistory: z.ZodString;
        medications: z.ZodString;
        allergies: z.ZodString;
        examinationFindings: z.ZodString;
        laboratoryFindings: z.ZodString;
        assessmentFromSource: z.ZodString;
        planFromSource: z.ZodString;
        followUpFromSource: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        chiefComplaint: string;
        relevantHistory: string;
        medications: string;
        allergies: string;
        examinationFindings: string;
        laboratoryFindings: string;
        assessmentFromSource: string;
        planFromSource: string;
        followUpFromSource: string;
    }, {
        chiefComplaint: string;
        relevantHistory: string;
        medications: string;
        allergies: string;
        examinationFindings: string;
        laboratoryFindings: string;
        assessmentFromSource: string;
        planFromSource: string;
        followUpFromSource: string;
    }>;
    patientExplanation: z.ZodObject<{
        overview: z.ZodString;
        medicinesMentioned: z.ZodString;
        followUp: z.ZodString;
        questionsForHealthcareProfessional: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        overview: string;
        medicinesMentioned: string;
        followUp: string;
        questionsForHealthcareProfessional: string[];
    }, {
        overview: string;
        medicinesMentioned: string;
        followUp: string;
        questionsForHealthcareProfessional: string[];
    }>;
    missingInformation: z.ZodArray<z.ZodString, "many">;
    conflictingInformation: z.ZodArray<z.ZodString, "many">;
    uncertainties: z.ZodArray<z.ZodString, "many">;
    safetyNotes: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    clinicalSummary: {
        chiefComplaint: string;
        relevantHistory: string;
        medications: string;
        allergies: string;
        examinationFindings: string;
        laboratoryFindings: string;
        assessmentFromSource: string;
        planFromSource: string;
        followUpFromSource: string;
    };
    patientExplanation: {
        overview: string;
        medicinesMentioned: string;
        followUp: string;
        questionsForHealthcareProfessional: string[];
    };
    missingInformation: string[];
    conflictingInformation: string[];
    uncertainties: string[];
    safetyNotes: string[];
}, {
    clinicalSummary: {
        chiefComplaint: string;
        relevantHistory: string;
        medications: string;
        allergies: string;
        examinationFindings: string;
        laboratoryFindings: string;
        assessmentFromSource: string;
        planFromSource: string;
        followUpFromSource: string;
    };
    patientExplanation: {
        overview: string;
        medicinesMentioned: string;
        followUp: string;
        questionsForHealthcareProfessional: string[];
    };
    missingInformation: string[];
    conflictingInformation: string[];
    uncertainties: string[];
    safetyNotes: string[];
}>;
export type StructuredAnalysisResult = z.infer<typeof StructuredAnalysisResultSchema>;
/**
 * Individual provider outcome in execution
 */
export declare const ProviderResultItemSchema: z.ZodObject<{
    provider: z.ZodEnum<["gemini", "deepseek"]>;
    model: z.ZodString;
    latencyMs: z.ZodNumber;
    result: z.ZodNullable<z.ZodObject<{
        clinicalSummary: z.ZodObject<{
            chiefComplaint: z.ZodString;
            relevantHistory: z.ZodString;
            medications: z.ZodString;
            allergies: z.ZodString;
            examinationFindings: z.ZodString;
            laboratoryFindings: z.ZodString;
            assessmentFromSource: z.ZodString;
            planFromSource: z.ZodString;
            followUpFromSource: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        }, {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        }>;
        patientExplanation: z.ZodObject<{
            overview: z.ZodString;
            medicinesMentioned: z.ZodString;
            followUp: z.ZodString;
            questionsForHealthcareProfessional: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        }, {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        }>;
        missingInformation: z.ZodArray<z.ZodString, "many">;
        conflictingInformation: z.ZodArray<z.ZodString, "many">;
        uncertainties: z.ZodArray<z.ZodString, "many">;
        safetyNotes: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    }, {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    }>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    provider: "gemini" | "deepseek";
    model: string;
    latencyMs: number;
    result: {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    } | null;
    error?: string | null | undefined;
}, {
    provider: "gemini" | "deepseek";
    model: string;
    latencyMs: number;
    result: {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    } | null;
    error?: string | null | undefined;
}>;
export type ProviderResultItem = z.infer<typeof ProviderResultItemSchema>;
/**
 * Standard Envelope returned by POST /api/v1/medical-records/analyze
 */
export declare const RecordAnalyzeResponseSchema: z.ZodObject<{
    requestId: z.ZodString;
    requestedProvider: z.ZodEnum<["gemini", "deepseek", "compare"]>;
    actualProvider: z.ZodString;
    actualModel: z.ZodString;
    completedResults: z.ZodArray<z.ZodObject<{
        provider: z.ZodEnum<["gemini", "deepseek"]>;
        model: z.ZodString;
        latencyMs: z.ZodNumber;
        result: z.ZodNullable<z.ZodObject<{
            clinicalSummary: z.ZodObject<{
                chiefComplaint: z.ZodString;
                relevantHistory: z.ZodString;
                medications: z.ZodString;
                allergies: z.ZodString;
                examinationFindings: z.ZodString;
                laboratoryFindings: z.ZodString;
                assessmentFromSource: z.ZodString;
                planFromSource: z.ZodString;
                followUpFromSource: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            }, {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            }>;
            patientExplanation: z.ZodObject<{
                overview: z.ZodString;
                medicinesMentioned: z.ZodString;
                followUp: z.ZodString;
                questionsForHealthcareProfessional: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            }, {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            }>;
            missingInformation: z.ZodArray<z.ZodString, "many">;
            conflictingInformation: z.ZodArray<z.ZodString, "many">;
            uncertainties: z.ZodArray<z.ZodString, "many">;
            safetyNotes: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            clinicalSummary: {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            };
            patientExplanation: {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            };
            missingInformation: string[];
            conflictingInformation: string[];
            uncertainties: string[];
            safetyNotes: string[];
        }, {
            clinicalSummary: {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            };
            patientExplanation: {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            };
            missingInformation: string[];
            conflictingInformation: string[];
            uncertainties: string[];
            safetyNotes: string[];
        }>>;
        error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        provider: "gemini" | "deepseek";
        model: string;
        latencyMs: number;
        result: {
            clinicalSummary: {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            };
            patientExplanation: {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            };
            missingInformation: string[];
            conflictingInformation: string[];
            uncertainties: string[];
            safetyNotes: string[];
        } | null;
        error?: string | null | undefined;
    }, {
        provider: "gemini" | "deepseek";
        model: string;
        latencyMs: number;
        result: {
            clinicalSummary: {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            };
            patientExplanation: {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            };
            missingInformation: string[];
            conflictingInformation: string[];
            uncertainties: string[];
            safetyNotes: string[];
        } | null;
        error?: string | null | undefined;
    }>, "many">;
    fallbackApplied: z.ZodBoolean;
    fallbackReason: z.ZodNullable<z.ZodString>;
    latencyMs: z.ZodNumber;
    safetyDisclaimer: z.ZodString;
    validatedResult: z.ZodNullable<z.ZodObject<{
        clinicalSummary: z.ZodObject<{
            chiefComplaint: z.ZodString;
            relevantHistory: z.ZodString;
            medications: z.ZodString;
            allergies: z.ZodString;
            examinationFindings: z.ZodString;
            laboratoryFindings: z.ZodString;
            assessmentFromSource: z.ZodString;
            planFromSource: z.ZodString;
            followUpFromSource: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        }, {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        }>;
        patientExplanation: z.ZodObject<{
            overview: z.ZodString;
            medicinesMentioned: z.ZodString;
            followUp: z.ZodString;
            questionsForHealthcareProfessional: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        }, {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        }>;
        missingInformation: z.ZodArray<z.ZodString, "many">;
        conflictingInformation: z.ZodArray<z.ZodString, "many">;
        uncertainties: z.ZodArray<z.ZodString, "many">;
        safetyNotes: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    }, {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    }>>;
}, "strip", z.ZodTypeAny, {
    latencyMs: number;
    requestId: string;
    requestedProvider: "gemini" | "deepseek" | "compare";
    actualProvider: string;
    actualModel: string;
    completedResults: {
        provider: "gemini" | "deepseek";
        model: string;
        latencyMs: number;
        result: {
            clinicalSummary: {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            };
            patientExplanation: {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            };
            missingInformation: string[];
            conflictingInformation: string[];
            uncertainties: string[];
            safetyNotes: string[];
        } | null;
        error?: string | null | undefined;
    }[];
    fallbackApplied: boolean;
    fallbackReason: string | null;
    safetyDisclaimer: string;
    validatedResult: {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    } | null;
}, {
    latencyMs: number;
    requestId: string;
    requestedProvider: "gemini" | "deepseek" | "compare";
    actualProvider: string;
    actualModel: string;
    completedResults: {
        provider: "gemini" | "deepseek";
        model: string;
        latencyMs: number;
        result: {
            clinicalSummary: {
                chiefComplaint: string;
                relevantHistory: string;
                medications: string;
                allergies: string;
                examinationFindings: string;
                laboratoryFindings: string;
                assessmentFromSource: string;
                planFromSource: string;
                followUpFromSource: string;
            };
            patientExplanation: {
                overview: string;
                medicinesMentioned: string;
                followUp: string;
                questionsForHealthcareProfessional: string[];
            };
            missingInformation: string[];
            conflictingInformation: string[];
            uncertainties: string[];
            safetyNotes: string[];
        } | null;
        error?: string | null | undefined;
    }[];
    fallbackApplied: boolean;
    fallbackReason: string | null;
    safetyDisclaimer: string;
    validatedResult: {
        clinicalSummary: {
            chiefComplaint: string;
            relevantHistory: string;
            medications: string;
            allergies: string;
            examinationFindings: string;
            laboratoryFindings: string;
            assessmentFromSource: string;
            planFromSource: string;
            followUpFromSource: string;
        };
        patientExplanation: {
            overview: string;
            medicinesMentioned: string;
            followUp: string;
            questionsForHealthcareProfessional: string[];
        };
        missingInformation: string[];
        conflictingInformation: string[];
        uncertainties: string[];
        safetyNotes: string[];
    } | null;
}>;
export type RecordAnalyzeResponse = z.infer<typeof RecordAnalyzeResponseSchema>;
/**
 * Provider status schema for GET /api/v1/providers
 */
export declare const ProviderStatusItemSchema: z.ZodObject<{
    id: z.ZodEnum<["gemini", "deepseek"]>;
    name: z.ZodString;
    model: z.ZodString;
    configured: z.ZodBoolean;
    isDefault: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: "gemini" | "deepseek";
    model: string;
    name: string;
    configured: boolean;
    isDefault: boolean;
}, {
    id: "gemini" | "deepseek";
    model: string;
    name: string;
    configured: boolean;
    isDefault: boolean;
}>;
export type ProviderStatusItem = z.infer<typeof ProviderStatusItemSchema>;
export declare const ProvidersStatusResponseSchema: z.ZodObject<{
    providers: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<["gemini", "deepseek"]>;
        name: z.ZodString;
        model: z.ZodString;
        configured: z.ZodBoolean;
        isDefault: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: "gemini" | "deepseek";
        model: string;
        name: string;
        configured: boolean;
        isDefault: boolean;
    }, {
        id: "gemini" | "deepseek";
        model: string;
        name: string;
        configured: boolean;
        isDefault: boolean;
    }>, "many">;
    supportsCompare: z.ZodBoolean;
    fallbackAllowed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    providers: {
        id: "gemini" | "deepseek";
        model: string;
        name: string;
        configured: boolean;
        isDefault: boolean;
    }[];
    supportsCompare: boolean;
    fallbackAllowed: boolean;
}, {
    providers: {
        id: "gemini" | "deepseek";
        model: string;
        name: string;
        configured: boolean;
        isDefault: boolean;
    }[];
    supportsCompare: boolean;
    fallbackAllowed: boolean;
}>;
export type ProvidersStatusResponse = z.infer<typeof ProvidersStatusResponseSchema>;
//# sourceMappingURL=analyze.schema.d.ts.map