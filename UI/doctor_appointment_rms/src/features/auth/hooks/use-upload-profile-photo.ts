"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../api/user-api";

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.uploadProfilePhoto,

    onSuccess: () => {
      //  THE PROFESSIONAL CORRECTION:
      // Match the exact cache key we set up in useCurrentUser.
      // This instantly hits the active session layout and forces a smooth live update!
      queryClient.invalidateQueries({
        queryKey: ["auth", "current-user"],
      });

      toast.success("Profile photo updated successfully!");
    },

    onError: (error) => {
      console.error("Profile photo upload error:", error);
      toast.error("Failed to upload profile photo");
    },
  });
}