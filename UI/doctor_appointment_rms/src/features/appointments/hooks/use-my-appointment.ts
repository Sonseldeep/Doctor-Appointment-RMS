"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointments-api";
import { Appointment } from "../types/appointments.types";

export function useGetMyAppointments() {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", "me"],
    queryFn: appointmentsApi.getMyAppointments,
    select: (data) => {
      // Sort: Pending/Confirmed first, then by date ascending
      return [...data].sort((a, b) => {
        return new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime();
      });
    },
    retry: 1,
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsApi.confirmAppointment,
    onSuccess: () => {
      // Invalidate the query cache to trigger a seamless background list UI refresh
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}