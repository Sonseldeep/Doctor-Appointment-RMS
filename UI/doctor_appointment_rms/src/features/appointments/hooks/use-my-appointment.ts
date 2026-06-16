
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointments-api";
import { Appointment, CompleteAppointmentDto } from "../types/appointments.types"; // Ensure this import is updated

export function useGetMyAppointments() {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", "me"],
    queryFn: appointmentsApi.getMyAppointments,
    select: (data) => {
      return [...data].sort((a, b) => {
        return new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime();
      });
    },
    retry: 1,
  });
}


export function useCreateClinicalNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    // Make sure it explicitly uses the object you updated
    mutationFn: (payload: any) => appointmentsApi.createClinicalNotes(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsApi.confirmAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}

// ADD THIS EXPORTED HOOK
export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteAppointmentDto) => appointmentsApi.completeAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}

// ADD THIS
export function useGetClinicalNotesHistory() {
  return useQuery({
    queryKey: ["clinical-notes", "history"],
    queryFn: appointmentsApi.getClinicalNotesHistory,
  });
}