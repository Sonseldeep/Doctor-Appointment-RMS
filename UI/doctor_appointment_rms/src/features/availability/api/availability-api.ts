import axiosClient from "@/lib/axios";
import { 
  AvailabilitySlot, 
  CreateAvailabilityRequest, 
  UpdateAvailabilityRequest 
} from "../types/availability.types";

export const availabilityApi = {
  // 1. Get current logged-in doctor's availability
  getMyAvailability: async (): Promise<AvailabilitySlot[]> => {
    const res = await axiosClient.get<AvailabilitySlot[]>("/api/availability/me");
    return res.data;
  },

  // 2. Create a new availability slot
  createAvailability: async (data: CreateAvailabilityRequest): Promise<{ availabilityId: string }> => {
    const res = await axiosClient.post<{ availabilityId: string }>("/api/availability", data);
    return res.data;
  },

  // 3. Edit an existing time slot configuration
  updateAvailability: async (id: string, data: UpdateAvailabilityRequest): Promise<void> => {
    await axiosClient.put(`/api/availability/${id}`, data);
  },

  // 4. Delete an availability slot completely
  deleteAvailability: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/availability/${id}`);
  },

  // 5. Patient-facing endpoint to browse a specific doctor's slots by date
  getDoctorAvailabilityByDate: async (doctorUserId: string, date: string): Promise<AvailabilitySlot[]> => {
    const res = await axiosClient.get<AvailabilitySlot[]>(`/api/doctors/${doctorUserId}/availability/${date}`);
    return res.data;
  }
};