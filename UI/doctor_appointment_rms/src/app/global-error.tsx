"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Automatically report the error to Sentry when the component mounts
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Critical Application Error
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            The application failed to load completely. Our engineering team has been notified of this issue.
          </p>
          <button
            onClick={() => reset()}
            className="rounded bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}