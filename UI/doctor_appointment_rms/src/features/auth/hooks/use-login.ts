// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { authApi } from "../api/auth-api";
// import { tokenStorage } from "../utils/auth-storage";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export function useLogin() {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: authApi.login,

//     onSuccess: (data) => {
//       tokenStorage.setAccessToken(data.accessToken);

//       toast.success("Login successful");

//       router.push("/dashboard");
//     },

//     onError: (error: any) => {
//       const message =
//         error.response?.data?.message ??
//         "Something went wrong";

//       toast.error(message);
//     },
//   });
// }
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "../api/auth-api";
import { tokenStorage } from "../utils/auth-storage";

import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (data) => {
      // 1. store token
      tokenStorage.setAccessToken(data.accessToken);

      // 2. update react-query cache immediately
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // 3. toast ONLY ONCE
      toast.success("Login successful");

      // 4. force redirect immediately
      router.replace("/dashboard");
    },

    onError: () => {
      toast.error("Invalid credentials");
    },
  });
}
