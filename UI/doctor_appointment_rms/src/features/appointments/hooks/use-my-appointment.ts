"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointments-api";
import { Appointment, CompleteAppointmentDto, PagedResult } from "../types/appointments.types"; 

// 1. ADDED DEFAULT VALUES: page = 1, pageSize = 10
export function useGetMyAppointments(page: number = 1, pageSize: number = 10) {
  return useQuery<PagedResult<Appointment>, Error>({
    queryKey: ["appointments", "me", page, pageSize],
    queryFn: () => appointmentsApi.getMyAppointments(page, pageSize),
    select: (data) => {
      // Return data as is, assuming sorting is handled by your API or needs to stay here
      return {
        ...data,
        items: [...data.items].sort((a, b) => {
          return new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime();
        }),
      };
    },
    retry: 1,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 15000, 
  });
}

export function useCreateClinicalNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => appointmentsApi.createClinicalNotes(payload),
    onSuccess: () => {
      // 2. EXPLICITLY invalidate everything under this key
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"], exact: false });
    },
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsApi.confirmAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"], exact: false });
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteAppointmentDto) => appointmentsApi.completeAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"], exact: false });
    },
  });
}

export function useGetClinicalNotesHistory() {
  return useQuery({
    queryKey: ["clinical-notes", "history"],
    queryFn: appointmentsApi.getClinicalNotesHistory,
  });
}