// export type CreateAppointmentDto = {
//   doctorUserId: string;
//   startUtc: string;
//   endUtc: string;
//   notes: string;
// };


// export interface Appointment {
//   id: string;
//   patientUserId: string;
//   doctorUserId: string;
//   doctorName?: string;        // Add these for display
//   specialty?: string;          // 
//   location?: string;           // (fetch from backend if available)
//   startUtc: string;
//   endUtc: string;
//   status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Scheduled";
//   notes: string;
//   appointmentType?: "In-Person" | "Virtual";
// }

// export interface DashboardStats {
//   upcomingCount: number;
//   completedCount: number;
//   cancelledCount: number;
//   prescriptionCount?: number;
//   medicalReportsCount?: number;
// }

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
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes?: string;
}