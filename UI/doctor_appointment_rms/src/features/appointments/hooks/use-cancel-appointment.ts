"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      
      const res = await axiosClient.post(`/api/appointments/${appointmentId}/cancel`);
      return res.data;
    },
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}