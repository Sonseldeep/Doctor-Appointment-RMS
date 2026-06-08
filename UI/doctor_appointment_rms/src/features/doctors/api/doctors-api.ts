import axiosClient from "@/lib/axios";
import { Doctor } from "../types/doctor.types";

export const doctorsApi = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    const res = await axiosClient.get<Doctor[]>("/api/doctors");
    return res.data;
  },

  getDoctorById: async (doctorId: string): Promise<Doctor> => {
    const res = await axiosClient.get<Doctor>(`/api/doctors/${doctorId}`);
    return res.data;
  },

  searchDoctors: async (specialization: string): Promise<Doctor[]> => {
    const res = await axiosClient.get<Doctor[]>(
      `/api/doctors?specialization=${specialization}`
    );
    return res.data;
  },
};