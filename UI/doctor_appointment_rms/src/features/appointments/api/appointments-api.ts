import axiosClient from "@/lib/axios";
import { CreateAppointmentDto, Appointment, CompleteAppointmentDto, PagedResult } from "../types/appointments.types";

export const appointmentsApi = {
  createAppointment: async (payload: CreateAppointmentDto): Promise<Appointment> => {
    const res = await axiosClient.post<Appointment>("/api/appointments", payload);
    return res.data;
  },

  getMyAppointments: async (page: number, pageSize: number): Promise<PagedResult<Appointment>> => {
    const res = await axiosClient.get<PagedResult<Appointment>>(`/api/appointments/me`, {
      params: { page, pageSize }
    });
    return res.data;
  },

  getAppointments: async (): Promise<Appointment[]> => {
    const res = await axiosClient.get<Appointment[]>("/api/appointments");
    return res.data;
  },

  confirmAppointment: async (appointmentId: string): Promise<void> => {
    await axiosClient.post(`/api/appointments/${appointmentId}/confirm`);
  },

  createClinicalNotes: async (payload: any): Promise<any> => {
    const res = await axiosClient.post("/api/clinical-notes", payload);
    return res.data;
  },

  completeAppointment: async (payload: CompleteAppointmentDto): Promise<void> => {
    console.log("API: completeAppointment called with:", payload);
    await axiosClient.post(`/api/appointments/${payload.appointmentId}/complete`, payload);
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    await axiosClient.delete(`/api/appointments/${appointmentId}`);
  },

  getClinicalNotesHistory: async (): Promise<any[]> => {
    const res = await axiosClient.get("/api/clinical-notes/me");
    return res.data;
  },
};