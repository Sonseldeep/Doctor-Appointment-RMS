"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ratingsApi } from "../api/ratings-api";
import type { CreateRatingDto, UpdateRatingDto } from "../types/ratings.types";

/**
 * Hook to retrieve doctor performance evaluation metrics, average scores, and public reviews
 */
export function useGetDoctorRatings(doctorUserId: string) {
  return useQuery({
    queryKey: ["doctor-ratings", doctorUserId],
    queryFn: () => ratingsApi.getDoctorRatings(doctorUserId),
    enabled: !!doctorUserId,
    staleTime: 1000 * 60 * 10, // Ratings stay fresh for 10 minutes
  });
}

/**
 * Hook to execute a rating submission after an completed consultation workflow (Patient Only)
 */
export function useSubmitDoctorRating(doctorUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRatingDto) => ratingsApi.submitDoctorRating(doctorUserId, data),
    onSuccess: () => {
      toast.success("Thank you! Your feedback has been published.");
      // Invalidate the public profile view for this practitioner
      queryClient.invalidateQueries({ queryKey: ["doctor-ratings", doctorUserId] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit evaluation profile";
      toast.error(message);
    },
  });
}

/**
 * Hook to allow modification of a submitted rating instance (Patient Only)
 */
export function useUpdateRating(doctorUserId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ratingId, data }: { ratingId: string; data: UpdateRatingDto }) =>
      ratingsApi.updateRating(ratingId, data),
    onSuccess: () => {
      toast.success("Your review was modified successfully.");
      
      if (doctorUserId) {
        queryClient.invalidateQueries({ queryKey: ["doctor-ratings", doctorUserId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["doctor-ratings"] });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to save changed feedback information";
      toast.error(message);
    },
  });
}