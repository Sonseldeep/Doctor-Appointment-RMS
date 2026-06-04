"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { userApi } from "../api/user-api";

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.uploadProfilePhoto,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      toast.success("Profile photo updated");
    },

    onError: () => {
      toast.error("Failed to upload profile photo");
    },
  });
}