"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { appointmentsApi } from "../api/appointments-api";
import { CreateAppointmentDto } from "../types/appointments.types";

export function useCreateAppointment() {
  return useMutation({
    mutationFn: appointmentsApi.createAppointment,
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to book appointment";
      toast.error(message);
    },
  });
}