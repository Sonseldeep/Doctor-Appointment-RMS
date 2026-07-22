import axiosClient from "@/lib/axios";

import {
  CurrentUser,
  DoctorProfile,
  PatientProfile,
  UploadProfilePhotoResponse,
} from "../types/auth.types";

export const userApi = {

  meDoctor: async (): Promise<DoctorProfile> => {
    const res = await axiosClient.get<DoctorProfile>("/api/doctors/me");
    return res.data;
  },


  mePatient: async (): Promise<PatientProfile> => {
    const res = await axiosClient.get<PatientProfile>("/api/patients/me");
    return res.data;
  },

 
  me: async (role?: any): Promise<CurrentUser> => {
    try {
      const res = await axiosClient.get<any>("/users/me");
      const baseUser = res.data;
      const actualRole = baseUser.role || (typeof role === "string" ? role : undefined);

      if (actualRole === "Doctor") {
        try {
          const doctorData = await userApi.meDoctor();
          return { ...baseUser, ...doctorData };
        } catch (docErr) {
          console.warn("[userApi] Could not load detailed doctor metadata, using base user instead.", docErr);
          return baseUser; 
        }
      }

      if (actualRole === "Registered" || actualRole === "Patient") {
        try {
          const patientData = await userApi.mePatient();
          return { ...baseUser, ...patientData };
        } catch (patErr) {
          console.warn("[userApi] Could not load detailed patient metadata, using base user instead.", patErr);
          return baseUser;
        }
      }

      return baseUser;
    } catch (error) {
      console.error("[userApi] Failed to fetch user profile:", error);
      throw error;
    }
  },

  
  uploadProfilePhoto: async (
    file: File
  ): Promise<UploadProfilePhotoResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosClient.post<UploadProfilePhotoResponse>(
      "/users/me/photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },
};