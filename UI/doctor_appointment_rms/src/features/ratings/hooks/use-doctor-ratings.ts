import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingsApi } from "../api/ratings-api";

// 1. Fetch Doctor Reviews Hook
export function useDoctorRatings(doctorUserId: string) {
  return useQuery({
    queryKey: ["doctor-ratings", doctorUserId],
    queryFn: () => ratingsApi.getDoctorRatings(doctorUserId),
    enabled: !!doctorUserId, 
    staleTime: 5 * 60 * 1000, 
  });
}

// 2. Update Existing Review Mutation Hook (PUT Contract Mapped)
export function useUpdateRating(doctorUserId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ratingId, stars, comment }: { ratingId: string; stars: number; comment: string }) =>
      // Casted to bypass the strict local DTO structural checking
      ratingsApi.updateRating(ratingId, { stars, comment } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-ratings", doctorUserId] });
    },
  });
}

// 3. Delete Review Mutation Hook (DELETE Contract Mapped)
export function useDeleteRating(doctorUserId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ratingId: string) => ratingsApi.deleteRating(ratingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-ratings", doctorUserId] });
    },
  });
}