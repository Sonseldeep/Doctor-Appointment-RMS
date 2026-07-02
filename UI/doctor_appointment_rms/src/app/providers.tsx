"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { SignalRProvider } from "@/providers/signalr-provider";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SignalRProvider>
        {children}
      </SignalRProvider>
    </QueryClientProvider>
  );
}