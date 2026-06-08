export type CreateAppointmentDto = {
  doctorUserId: string;
  startUtc: string;  // ISO 8601 format
  endUtc: string;    // ISO 8601 format
  notes: string;
};

export interface Appointment {
  id: string;
  patientUserId: string;
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes: string;
}