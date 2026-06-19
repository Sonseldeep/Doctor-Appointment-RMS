
export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Scheduled" | string;

export interface Appointment {
  id: string;
  patientUserId: string;
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  status: AppointmentStatus;
  notes: string;
  
  // Doctor/Practitioner Meta Context
  doctorName?: string;
  doctorSpecialization?: string;
  specialty?: string; 

  // Patient Profile Meta Context
  patientName?: string;
  patientSex?: string;
  patientAge?: number;

  // Structural UI Layout Fields
  location?: string;
  appointmentType?: string;
}

// Data Transfer Object for creating new appointments
export interface CreateAppointmentDto {
  slotId?: string;
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes: string;
}

// ADD THIS INTERFACE HERE
export interface CompleteAppointmentDto {
  appointmentId: string;
  diagnosis: string;
  observations: string;
  treatmentSummary: string;
  followUpDate: string;
  followUpInstructions: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    durationInDays: number;
    instructions: string;
  }>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}