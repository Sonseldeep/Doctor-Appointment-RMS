// "use client";

// import { useEffect, useState } from "react";

// import { useQuery } from "@tanstack/react-query";

// import { userApi } from "../api/user-api";
// import { tokenStorage } from "../utils/auth-storage";

// export function useCurrentUser() {
//   const [enabled, setEnabled] = useState(false);

//   useEffect(() => {
//     setEnabled(!!tokenStorage.getAccessToken());
//   }, []);

//   return useQuery({
//     queryKey: ["me"],
//     queryFn: userApi.me,
//     enabled,
//     retry: false,
//   });
// }

"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import { tokenStorage } from "../utils/auth-storage";

export function useCurrentUser() {
  // Read token synchronously — no useState/useEffect delay
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    queryKey: ["me"],
    queryFn: userApi.me,
    enabled: hasToken,
    retry: false,
  });
}