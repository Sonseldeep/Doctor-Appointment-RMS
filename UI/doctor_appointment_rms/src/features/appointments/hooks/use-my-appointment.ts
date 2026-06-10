// "use client";

// import { useQuery } from "@tanstack/react-query";

// export interface Appointment {
//   id: string;
//   patientUserId: string;
//   doctorUserId: string;
//   startUtc: string;
//   endUtc: string;
//   status: "Pending" | "Confirmed" | "Completed" | string;
//   notes: string;
//   doctorName: string;
//   doctorSpecialization: string;
//   patientName: string;
//   patientSex: string;
//   patientAge: number;
// }

// async function fetchMyAppointments(): Promise<Appointment[]> {
//   // NOTE: If your app uses an Axios instance (like 'api' or 'axiosInstance'), 
//   // replacing this fetch block with: const response = await api.get("/appointments/me"); return response.data; is ideal.
//   const response = await fetch("https://localhost:5001/api/appointments/me", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // Crucial: Passes session cookies along to your local ASP.NET Core port
//   });

//   if (!response.ok) {
//     throw new Error(`Server returned status code: ${response.status}`);
//   }
//   return response.json();
// }

// export function useGetMyAppointments() {
//   return useQuery<Appointment[], Error>({
//     queryKey: ["appointments", "me"],
//     queryFn: fetchMyAppointments,
//     retry: 1,
//   });
// }

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "../api/appointments-api";
import { Appointment } from "../types/appointments.types";

export function useGetMyAppointments() {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments", "me"],
    // FIXED: Swapped raw fetch to appointmentsApi to ensure token injection and clear 401s
    queryFn: appointmentsApi.getMyAppointments,
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