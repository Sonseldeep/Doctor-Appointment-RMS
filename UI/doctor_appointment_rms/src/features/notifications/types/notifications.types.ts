export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 
    | "AppointmentBooked" 
    | "AppointmentCancelled" 
    | "AppointmentConfirmed" 
    | "AppointmentCompleted" 
    | "LabReportReady" 
    | "ClinicalNoteAdded";
  appointmentId?: string;
  isRead: boolean;
  createdAtUtc: string;
}