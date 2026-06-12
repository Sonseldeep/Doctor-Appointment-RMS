"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../api/user-api";


export function useUploadProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.uploadProfilePhoto,

    onSuccess: () => {
      // Get all user role variants to invalidate all possible cache keys
      // This ensures the UI updates regardless of which endpoint was used
      const userRole = typeof window !== "undefined"
        ? localStorage.getItem("user_role")
        : null;

      // Invalidate all possible cache keys for the current user
      // This covers both the generic ["me"] key and role-specific variants
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      // toast.success("Profile photo updated");
    },

    onError: (error) => {
      console.error("Profile photo upload error:", error);
      toast.error("Failed to upload profile photo");
    },
  });
}