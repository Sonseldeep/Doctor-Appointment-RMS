import axiosClient from "@/lib/axios";

import type {
  CurrentUser,
  DoctorProfile,
  PatientProfile,
  UploadProfilePhotoResponse,
} from "../types/auth.types";

export const userApi = {
  /**
   * Fetch doctor profile
   */
  meDoctor: async (): Promise<DoctorProfile> => {
    const res = await axiosClient.get<DoctorProfile>("/api/doctors/me");
    return res.data;
  },

  /**
   * Fetch patient profile
   */
  mePatient: async (): Promise<PatientProfile> => {
    const res = await axiosClient.get<PatientProfile>("/api/patients/me");
    return res.data;
  },

  /**
   * Generic profile fetch - calls appropriate endpoint based on role
   */
  me: async (role?: string): Promise<CurrentUser> => {
    try {
      if (role === "Doctor") {
        return await userApi.meDoctor();
      }

      if (role === "Registered") {
        return await userApi.mePatient();
      }

      const res = await axiosClient.get<CurrentUser>("/users/me");
      return res.data;
    } catch (error) {
      console.error("[userApi] Failed to fetch user profile:", error);
      throw error;
    }
  },

  /**
   * Upload profile photo for any role
   * Works the same for all user types
   */
  uploadProfilePhoto: async (
    file: File,
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
      },
    );

    return res.data;
  },
};
