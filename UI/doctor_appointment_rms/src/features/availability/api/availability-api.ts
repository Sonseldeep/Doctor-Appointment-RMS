import axiosClient from "@/lib/axios";
import { 
  AvailabilitySlot, 
  CreateAvailabilityRequest, 
  UpdateAvailabilityRequest 
} from "../types/availability.types";

export const availabilityApi = {

  getMyAvailability: async (): Promise<AvailabilitySlot[]> => {
    const res = await axiosClient.get<AvailabilitySlot[]>("/api/availability/me");
    return res.data;
  },

  createAvailability: async (data: CreateAvailabilityRequest): Promise<{ availabilityId: string }> => {
    const res = await axiosClient.post<{ availabilityId: string }>("/api/availability", data);
    return res.data;
  },

  updateAvailability: async (id: string, data: UpdateAvailabilityRequest): Promise<void> => {
    await axiosClient.put(`/api/availability/${id}`, data);
  },

  deleteAvailability: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/availability/${id}`);
  },

 getDoctorAvailabilityByDate: async (doctorUserId: string, date: string): Promise<AvailabilitySlot[]> => {
    const res = await axiosClient.get<AvailabilitySlot[]>(`/api/doctors/${doctorUserId}/availability/${date}`);
    return res.data;
  },
  
  getDoctorAvailableDates: async (doctorId: string): Promise<any> => {
    const res = await axiosClient.get(`/api/${doctorId}/availability`);
    return res.data;
  }
};