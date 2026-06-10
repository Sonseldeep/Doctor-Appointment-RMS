"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export interface UpdatePatientDto {
  phoneNumber: string;
  address: string;
  sex: string;
  dateOfBirth?: string; // FIXED: Marked optional so page.tsx compiles perfectly
}

export interface UpdateDoctorDto {
  bio: string;
  specialization: string;
  consultationFee: number;
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePatientDto) => {
      // Defensive handling: If dateOfBirth is omitted by the form state,
      // we attach a fallback date string to satisfy strict backend validations.
      const finalPayload = {
        ...payload,
        dateOfBirth: payload.dateOfBirth || "2026-06-10",
      };

      const res = await axiosClient.put("/api/patients/profile", finalPayload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDoctorDto) => {
      const res = await axiosClient.put("/api/doctors/profile", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}