"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clinicalNotesApi } from "../api/clinical-notes-api";
import type { CreateClinicalNoteDto, UpdateClinicalNoteDto } from "../types/clinical-notes.types";

/**
 * Hook to retrieve context-aware clinical notes
 */
export function useGetMyClinicalNotes() {
  return useQuery({
    queryKey: ["clinical-notes", "me"],
    queryFn: clinicalNotesApi.getMyClinicalNotes,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes standard
  });
}

/**
 * Hook to submit a new clinical note (Doctor Only)
 */
export function useCreateClinicalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicalNotesApi.createClinicalNote,
    onSuccess: () => {
      toast.success("Clinical note documented successfully!");
      // Invalidate clinical notes cache listings & related general records
      queryClient.invalidateQueries({ queryKey: ["clinical-notes"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit clinical note";
      toast.error(message);
    },
  });
}

/**
 * Hook to modify an existing clinical note (Doctor Only)
 */
export function useUpdateClinicalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      clinicalNoteId, 
      data 
    }: { 
      clinicalNoteId: string; 
      data: UpdateClinicalNoteDto 
    }) => clinicalNotesApi.updateClinicalNote(clinicalNoteId, data),
    onSuccess: () => {
      toast.success("Clinical note saved and updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["clinical-notes"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update clinical note";
      toast.error(message);
    },
  });
}

export function useGetUpcomingFollowUps() {
  return useQuery({
    queryKey: ["clinical-notes", "upcoming-followups"],
    queryFn: clinicalNotesApi.getUpcomingFollowUps,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}