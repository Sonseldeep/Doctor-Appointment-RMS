"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export interface UpdatePatientDto {
  phoneNumber: string;
  address: string;
  sex: string;
  dateOfBirth?: string;
}

export interface CreateDoctorProfileDto {
  nmcNumber: string; 
  bio: string;
  specialization: string;
  consultationFee: number;
}

export interface UpdateDoctorProfileDto {
  bio: string;
  specialization: string;
  consultationFee: number;
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePatientDto) => {
      
      const finalPayload = {
        ...payload,
        dateOfBirth: payload.dateOfBirth || null, 
      };
      
      const res = await axiosClient.put("/api/patients/profile", finalPayload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

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