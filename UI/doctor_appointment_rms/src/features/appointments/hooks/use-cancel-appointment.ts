"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      // Calls your exact backend route: POST /api/appointments/{appointmentId}/cancel
      const res = await axiosClient.post(`/api/appointments/${appointmentId}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      // Automatically refetches list views to clear out cancelled states seamlessly
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}