export interface MedicationDto {
  name: string;
  dosage: string;
  frequency: string;
  durationInDays: number;
  instructions: string;
}

export interface CreateClinicalNoteDto {
  appointmentId: string;
  diagnosis: string;
  observations: string;
  treatmentSummary: string;
  followUpDate: string; // ISO-8601 String
  followUpInstructions: string;
  medications: MedicationDto[];
}

// Request body matching PUT excluding appointmentId
export type UpdateClinicalNoteDto = Omit<CreateClinicalNoteDto, "appointmentId">;

export interface ClinicalNote extends CreateClinicalNoteDto {
  clinicalNoteId: string;
  doctorId: string;
  patientId: string;
  createdAt: string; // ISO-String
  updatedAt?: string; // ISO-String
}