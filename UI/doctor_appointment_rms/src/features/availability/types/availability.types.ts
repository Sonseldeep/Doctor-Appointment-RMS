export interface AvailabilitySlot {
  availabilityId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO String / HH:mm:ss
  endTime: string; // ISO String / HH:mm:ss
  slotDurationMinutes: number;
}

export interface CreateAvailabilityRequest {
  date: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface UpdateAvailabilityRequest {
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}