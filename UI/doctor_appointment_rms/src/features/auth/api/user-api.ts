// import axiosClient from "@/lib/axios";

// import {
//   CurrentUser,
//   DoctorProfile,
//   PatientProfile,
//   UploadProfilePhotoResponse,
// } from "../types/auth.types";

// export const userApi = {
//   /**
//    * Fetch doctor profile
//    */
//   meDoctor: async (): Promise<DoctorProfile> => {
//     const res = await axiosClient.get<DoctorProfile>("/api/doctors/me");
//     return res.data;
//   },

//   /**
//    * Fetch patient profile
//    */
//   mePatient: async (): Promise<PatientProfile> => {
//     const res = await axiosClient.get<PatientProfile>("/api/patients/me");
//     return res.data;
//   },

//   /**
//    * Generic profile fetch - calls appropriate endpoint based on role
//    */
//   me: async (role?: string): Promise<CurrentUser> => {
//     try {
//       if (role === "Doctor") {
//         return await userApi.meDoctor();
//       }

//       if (role === "Registered") {
//         return await userApi.mePatient();
//       }

//       const res = await axiosClient.get<CurrentUser>("/users/me");
//       return res.data;
//     } catch (error) {
//       console.error("[userApi] Failed to fetch user profile:", error);
//       throw error;
//     }
//   },

//   /**
//    * Upload profile photo for any role
//    * Works the same for all user types
//    */
//   uploadProfilePhoto: async (
//     file: File
//   ): Promise<UploadProfilePhotoResponse> => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await axiosClient.post<UploadProfilePhotoResponse>(
//       "/users/me/photo",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     return res.data;
//   },
// };

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
   * Generic profile fetch - verifies role with backend before calling extra sub-endpoints
   */
  me: async (role?: any): Promise<CurrentUser> => {
    try {
      // 1. Always fetch the core authenticated account profile first
      const res = await axiosClient.get<any>("/users/me");
      const baseUser = res.data;

      // 2. Extract the authoritative role from the server payload.
      // Falls back to string parameter only if it is not an object passed by TanStack Query.
      const actualRole = baseUser.role || (typeof role === "string" ? role : undefined);

      // 3. Dynamically fetch supplemental profiles based on the verified role
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

      // 4. Return base profile directly for Admin or other administrative accounts
      return baseUser;
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