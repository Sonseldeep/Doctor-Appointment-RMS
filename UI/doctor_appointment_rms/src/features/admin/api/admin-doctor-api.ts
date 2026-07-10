import axiosClient from "@/lib/axios";
import type {
  AdminActionType,
  AdminDoctor,
  AdminDoctorResponse,
} from "../types/admin-doctor.types";

export const adminDoctorsApi = {
 
  getAllDoctors: async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<AdminDoctorResponse> => {
    const res = await axiosClient.get<AdminDoctorResponse | AdminDoctor[]>(
      `/api/admin/doctors?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );

    const payload = res.data;

    if (Array.isArray(payload)) {
      return {
        data: payload,
        totalCount: payload.length,
        pageNumber,
        pageSize,
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
