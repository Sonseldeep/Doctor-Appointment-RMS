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
  followUpDate: string; 
  followUpInstructions: string;
  medications: MedicationDto[];
}


export type UpdateClinicalNoteDto = Omit<CreateClinicalNoteDto, "appointmentId">;

export interface ClinicalNote extends CreateClinicalNoteDto {
  clinicalNoteId: string;
  doctorId: string;
  patientId: string;
  createdAt: string; 
  updatedAt?: string; 
}