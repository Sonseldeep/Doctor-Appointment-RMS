import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityApi } from "../api/availability-api";
import { CreateAvailabilityRequest, UpdateAvailabilityRequest } from "../types/availability.types";

export function useMyAvailability() {
  return useQuery({
    queryKey: ["availability", "me"],
    queryFn: () => availabilityApi.getMyAvailability(),
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAvailabilityRequest) => availabilityApi.createAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", "me"] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAvailabilityRequest }) => 
      availabilityApi.updateAvailability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", "me"] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => availabilityApi.deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", "me"] });
    },
  });
}


export function useDoctorAvailability(doctorId: string | null) {
  return useQuery({
    queryKey: ["availability", doctorId],
    queryFn: async () => {
      if (!doctorId) return null;
      
      
      const res = await fetch(`https://localhost:5001/api/doctors/${doctorId}/availabilities`);
      if (!res.ok) {
        throw new Error("Doctor availability not found.");
      }
      return res.json();
    },
    enabled: !!doctorId, 
  });
}

export function useDoctorAvailabilityByDate(doctorId: string | undefined, date: string | null) {
  return useQuery({
    queryKey: ["availability", doctorId, date],
    queryFn: () => availabilityApi.getDoctorAvailabilityByDate(doctorId!, date!),
    enabled: !!doctorId && !!date, // Only run when both exist
  });
}