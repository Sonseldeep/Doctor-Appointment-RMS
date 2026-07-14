// import axiosClient from "@/lib/axios";
// import type {
//   AdminActionType,
//   AdminDoctor,
//   AdminDoctorResponse,
// } from "../types/admin-doctor.types";

// export const adminDoctorsApi = {
 
//   getAllDoctors: async (
//     pageNumber: number = 1,
//     pageSize: number = 10,
//   ): Promise<AdminDoctorResponse> => {
//     const res = await axiosClient.get<AdminDoctorResponse | AdminDoctor[]>(
//       `/api/admin/doctors?pageNumber=${pageNumber}&pageSize=${pageSize}`,
//     );

//     const payload = res.data;

//     if (Array.isArray(payload)) {
//       return {
//         data: payload,
//         totalCount: payload.length,
//         pageNumber,
//         pageSize,
//       };
//     }

//     return payload as AdminDoctorResponse;
//   },

//   // Approve a doctor using the backend's doctor user ID.
//   approveDoctors: async (doctorId: string): Promise<void> => {
//     await axiosClient.post(`/api/admin/doctors/${doctorId}/approve`);
//   },

//   // Suspend a doctor.
//   suspendDoctor: async (doctorId: string): Promise<void> => {
//     await axiosClient.post(`/api/admin/doctors/${doctorId}/suspend`);
//   },

//   // Generic action handler.
//   performAction: async (
//     doctorId: string,
//     action: AdminActionType,
//   ): Promise<void> => {
//     const endpoint =
//       action === "approve"
//         ? `/api/admin/doctors/${doctorId}/approve`
//         : `/api/admin/doctors/${doctorId}/suspend`;

//     await axiosClient.post(endpoint);
//   },
// };



import axiosClient from "@/lib/axios";
import type {
  AdminActionType,
  AdminDoctor,
  AdminDoctorResponse,
} from "../types/admin-doctor.types";

export interface DoctorFilterParams {
  Page?: number;
  PageSize?: number;
  SearchTerm?: string;
  Specialization?: string;
  Status?: string;
  [key: string]: any; 
}

export const adminDoctorsApi = {
  
  getAllDoctors: async (params: DoctorFilterParams): Promise<AdminDoctorResponse> => {
    // 1. Cleans out empty values so they aren't sent as blank string queries to the backend
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
    );

    // 2. Pass cleaned parameters via axios config object using PascalCase keys
    const res = await axiosClient.get<AdminDoctorResponse | AdminDoctor[]>(
      "/api/admin/doctors", 
      {
        params: cleanedParams,
      }
    );

    const payload = res.data;

    // 3. Fallback normalization check maps PascalCase query parameters back to frontend camelCase keys
    if (Array.isArray(payload)) {
      return {
        data: payload,
        totalCount: payload.length,
        pageNumber: params.Page || 1,
        pageSize: params.PageSize || 10,
      };
    }

    return payload as AdminDoctorResponse;
  },

  // Approve a doctor using the backend's doctor user ID.
  approveDoctors: async (doctorId: string): Promise<void> => {
    await axiosClient.post(`/api/admin/doctors/${doctorId}/approve`);
  },

  // Suspend a doctor.
  suspendDoctor: async (doctorId: string): Promise<void> => {
    await axiosClient.post(`/api/admin/doctors/${doctorId}/suspend`);
  },

  // Generic action handler.
  performAction: async (
    doctorId: string,
    action: AdminActionType,
  ): Promise<void> => {
    const endpoint =
      action === "approve"
        ? `/api/admin/doctors/${doctorId}/approve`
        : `/api/admin/doctors/${doctorId}/suspend`;

    await axiosClient.post(endpoint);
  },
};