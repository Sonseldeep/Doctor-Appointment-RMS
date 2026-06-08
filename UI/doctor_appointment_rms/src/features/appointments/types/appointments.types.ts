export type CreateAppointmentDto = {
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes: string;
};


export interface Appointment {
  id: string;
  patientUserId: string;
  doctorUserId: string;
  doctorName?: string;        // Add these for display
  specialty?: string;          // 
  location?: string;           // (fetch from backend if available)
  startUtc: string;
  endUtc: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Scheduled";
  notes: string;
  appointmentType?: "In-Person" | "Virtual";
}

export interface DashboardStats {
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
  prescriptionCount?: number;
  medicalReportsCount?: number;
}