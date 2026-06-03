"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,

    onSuccess: () => {
      toast.success("Password reset successful");
      router.push("/login");
    },

    onError: () => {
      toast.error("Failed to reset password");
    },
  });
}