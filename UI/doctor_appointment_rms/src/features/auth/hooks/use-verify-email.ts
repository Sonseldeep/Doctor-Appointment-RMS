"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { useRouter } from "next/navigation";

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.verifyEmail,

    onSuccess: () => {
      router.push("/login");
    },
  });
}