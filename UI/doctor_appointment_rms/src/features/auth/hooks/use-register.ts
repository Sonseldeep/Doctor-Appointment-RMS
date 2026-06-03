"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,

    onSuccess: (_, variables) => {
  router.push(`/verify-email?email=${variables.email}`);
},
  });
}