"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointments-api";
import { Appointment, CompleteAppointmentDto, PagedResult } from "../types/appointments.types"; 


export function useGetMyAppointments(page: number = 1, pageSize: number = 10) {
  return useQuery<PagedResult<Appointment>, Error>({
    queryKey: ["appointments", "me", page, pageSize],
    queryFn: () => appointmentsApi.getMyAppointments(page, pageSize),
    select: (data) => {
      
      return {
        ...data,
        items: [...data.items].sort((a, b) => {
          return new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime();
        }),
      };
    },
    retry: 1,
    staleTime: Infinity,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
   
  });
}

export function useCreateClinicalNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => appointmentsApi.createClinicalNotes(payload),
    onSuccess: () => {
      
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