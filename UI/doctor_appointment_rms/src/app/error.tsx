"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We will hook this up to Sentry in Step 2
    console.error("Caught by Next.js Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          A critical error occurred while rendering this page. Our engineering team has been notified.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2"
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Try again
      </button>
    </div>
  );
}