export interface AvailabilitySlot {
  availabilityId: string;
  date: string;
  startTime: string;
  endTime: string; 
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