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

  // Patient Profile Meta Context (Resolves the TS compilation errors)
  patientName?: string;
  patientSex?: string;
  patientAge?: number;

  // Structural UI Layout Fields
  location?: string;
  appointmentType?: string;
}

// Data Transfer Object for creating new appointments
export interface CreateAppointmentDto {
  slotId?: string; // Add this line to accept the database key reference
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes: string;
}