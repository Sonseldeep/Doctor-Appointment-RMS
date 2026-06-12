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

// Add this hook to fetch any specific doctor's slots using their userId
export function useDoctorAvailability(doctorId: string | null) {
  return useQuery({
    queryKey: ["availability", doctorId],
    queryFn: async () => {
      if (!doctorId) return null;
      
      // Hits your backend endpoint passing the userId: 2210c755-6201-4299-ac8d-1b8a7b2fd92a
      const res = await fetch(`https://localhost:5001/api/doctors/${doctorId}/availabilities`);
      if (!res.ok) {
        throw new Error("Doctor availability not found.");
      }
      return res.json();
    },
    enabled: !!doctorId, // Only run the network request if a doctorId is present
  });
}