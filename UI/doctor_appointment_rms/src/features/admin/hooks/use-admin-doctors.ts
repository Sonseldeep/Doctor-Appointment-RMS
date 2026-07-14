"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminDoctorsApi } from "@/features/admin/api/admin-doctor-api";
import type { AdminActionType } from "../types/admin-doctor.types";


export interface DoctorFilterParams {
  Page?: number;
  PageSize?: number;
  SearchTerm?: string;
  Specialization?: string;
  Status?: string;
  [key: string]: any;
}

export function useAdminDoctors(params: DoctorFilterParams) {
  return useQuery({
    queryKey: ["admin", "doctors", params], 
    queryFn: () => adminDoctorsApi.getAllDoctors(params),
  });
}

export function useApproveDoctorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => adminDoctorsApi.approveDoctors(doctorId),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
      toast.success("Doctor approved successfully!");
    },
    onError: (error: unknown) => {
      const responseError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        responseError.response?.data?.message || "Failed to approve doctor";
      toast.error(message);
    },
  });
}

export function useSuspendDoctorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => adminDoctorsApi.suspendDoctor(doctorId),
    onSuccess: () => {
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
      toast.success("Doctor suspended successfully!");
    },
    onError: (error: unknown) => {
      const responseError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        responseError.response?.data?.message || "Failed to suspend doctor";
      toast.error(message);
    },
  });
}

export function useAdminDoctorAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      action,
    }: {
      doctorId: string;
      action: AdminActionType;
    }) => adminDoctorsApi.performAction(doctorId, action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
      const actionText =
        variables.action === "approve" ? "approved" : "suspended";
      toast.success(`Doctor ${actionText} successfully!`);
    },
    onError: (error: unknown) => {
      const responseError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        responseError.response?.data?.message || "Failed to perform action";
      toast.error(message);
    },
  });
}
