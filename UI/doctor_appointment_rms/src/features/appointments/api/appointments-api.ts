import axiosClient from "@/lib/axios";
import { CreateAppointmentDto, Appointment } from "../types/appointments.types";

export const appointmentsApi = {
  createAppointment: async (payload: CreateAppointmentDto): Promise<Appointment> => {
    const res = await axiosClient.post<Appointment>(
      "/api/appointments",
      payload
    );
    return res.data;
  },

  // Get current user's appointments (works for both patient and doctor)
  getMyAppointments: async (): Promise<Appointment[]> => {
    const res = await axiosClient.get<Appointment[]>("/api/appointments/me");
    return res.data;
  },

  
  getAppointments: async (): Promise<Appointment[]> => {
    const res = await axiosClient.get<Appointment[]>("/api/appointments");
    return res.data;
  },

  confirmAppointment: async (appointmentId: string): Promise<void> => {
    await axiosClient.post(`/api/appointments/${appointmentId}/confirm`);
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    await axiosClient.delete(`/api/appointments/${appointmentId}`);
  },
};