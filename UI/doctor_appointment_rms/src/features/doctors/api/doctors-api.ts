// import axiosClient from "@/lib/axios";
// import { Doctor } from "../types/doctor.types";

// export const doctorsApi = {
//   getAllDoctors: async (): Promise<Doctor[]> => {
//     const res = await axiosClient.get<Doctor[]>("/api/doctors");
//     return res.data;
//   },

//   getDoctorById: async (doctorId: string): Promise<Doctor> => {
//     const res = await axiosClient.get<Doctor>(`/api/doctors/${doctorId}`);
//     return res.data;
//   },

//   searchDoctors: async (specialization: string): Promise<Doctor[]> => {
//     const res = await axiosClient.get<Doctor[]>(
//       `/api/doctors?specialization=${specialization}`
//     );
//     return res.data;
//   },
// };

import axiosClient from "@/lib/axios";
import { Doctor, DoctorsResponse } from "../types/doctor.types";

export const doctorsApi = {
  getAllDoctors: async (params?: {
    SearchTerm?: string;
    Specialization?: string;
    Page?: number;
    PageSize?: number;
  }): Promise<DoctorsResponse> => {
    // Passes the dynamic backend query variables safely straight to your server
    const res = await axiosClient.get<DoctorsResponse>("/api/doctors", { params });
    return res.data;
  },

  getDoctorById: async (doctorId: string): Promise<Doctor> => {
    const res = await axiosClient.get<Doctor>(`/api/doctors/${doctorId}`);
    return res.data;
  },

  searchDoctors: async (specialization: string): Promise<DoctorsResponse> => {
    const res = await axiosClient.get<DoctorsResponse>("/api/doctors", {
      params: { Specialization: specialization }
    });
    return res.data;
  },
};