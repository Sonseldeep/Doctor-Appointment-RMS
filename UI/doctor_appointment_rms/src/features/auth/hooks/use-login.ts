"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { tokenStorage } from "../utils/auth-storage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (data) => {
      tokenStorage.setAccessToken(data.accessToken);

      toast.success("Login successful");

      router.push("/dashboard");
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message ??
        "Something went wrong";

      toast.error(message);
    },
  });
}