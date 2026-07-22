export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Scheduled" | string;

export interface Appointment {
  id: string;
  patientUserId: string;
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  status: AppointmentStatus;
  notes: string;
  doctorName?: string;
  doctorSpecialization?: string;
  specialty?: string; 
  patientName?: string;
  patientSex?: string;
  patientAge?: number;

  location?: string;
  appointmentType?: string;
}

export interface CreateAppointmentDto {
  slotId?: string;
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes: string;
}

export interface CompleteAppointmentDto {
  appointmentId: string;
  diagnosis: string;
  observations: string;
  treatmentSummary: string;
  followUpSlotId?: string | null;
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