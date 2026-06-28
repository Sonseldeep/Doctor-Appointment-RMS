"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { appointmentsApi } from "../api/appointments-api";

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentsApi.createAppointment,

    onSuccess: async () => {
      // Refresh appointment caches immediately
      await queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      await queryClient.refetchQueries({
        queryKey: ["appointments"],
      });

      toast.success("Appointment booked successfully!");
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to book appointment";

      toast.error(message);
    },
  });
}