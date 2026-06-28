"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export interface UpdatePatientDto {
  phoneNumber: string;
  address: string;
  sex: string;
  dateOfBirth?: string;
}

// DTO for Initial Creation (POST /api/doctors/profile)
export interface CreateDoctorProfileDto {
  nmcNumber: string; 
  bio: string;
  specialization: string;
  consultationFee: number;
}

// DTO for Updates (PUT /api/doctors/profile) - Excludes NMC Number
export interface UpdateDoctorProfileDto {
  bio: string;
  specialization: string;
  consultationFee: number;
}

// PATIENT PROFILE (PUT)
export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePatientDto) => {
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

// DOCTOR PROFILE - CREATION (POST)
export function useCreateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDoctorProfileDto) => {
      const res = await axiosClient.post("/api/doctors/profile", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

// DOCTOR PROFILE - SUBSEQUENT UPDATES (PUT)
export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDoctorProfileDto) => {
      const res = await axiosClient.put("/api/doctors/profile", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}