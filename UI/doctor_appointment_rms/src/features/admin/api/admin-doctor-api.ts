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
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
    );

    const res = await axiosClient.get<AdminDoctorResponse | AdminDoctor[]>(
      "/api/admin/doctors", 
      {
        params: cleanedParams,
      }
    );

    const payload = res.data;
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

  approveDoctors: async (doctorId: string): Promise<void> => {
    await axiosClient.post(`/api/admin/doctors/${doctorId}/approve`);
  },

  suspendDoctor: async (doctorId: string): Promise<void> => {
    await axiosClient.post(`/api/admin/doctors/${doctorId}/suspend`);
  },

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