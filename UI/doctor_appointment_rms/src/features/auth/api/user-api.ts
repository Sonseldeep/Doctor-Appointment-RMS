import axiosClient from "@/lib/axios";

import {
  CurrentUser,
  DoctorProfile,
  PatientProfile,
  UploadProfilePhotoResponse,
} from "../types/auth.types";

export const userApi = {
  /**
   * Fetch doctor profile
   * Once backend implements /doctors/me, use this
   */
  meDoctor: async (): Promise<DoctorProfile> => {
    const res = await axiosClient.get<DoctorProfile>("/doctors/me");
    return res.data;
  },

  /**
   * Fetch patient profile
   * Once backend implements /patients/me, use this
   */
  mePatient: async (): Promise<PatientProfile> => {
    const res = await axiosClient.get<PatientProfile>("/patients/me");
    return res.data;
  },

  /**
   * Generic profile fetch - calls appropriate endpoint based on role
   * TEMPORARY: Uses /users/me until backend implements role-specific endpoints
   */
  me: async (role?: string): Promise<CurrentUser> => {
    try {
      // If role is provided, try the role-specific endpoints first
      if (role === "Doctor") {
        try {
          return await userApi.meDoctor();
        } catch (error) {
          console.warn("[userApi] /doctors/me not available, falling back to /users/me");
        }
      } else if (role === "User" || role === "Patient") {
        try {
          return await userApi.mePatient();
        } catch (error) {
          console.warn("[userApi] /patients/me not available, falling back to /users/me");
        }
      }

      // TEMPORARY FALLBACK: Use old endpoint until backend is updated
      // Once backend has /doctors/me and /patients/me, remove this
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