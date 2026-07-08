"use client";
import dynamic from "next/dynamic";

// Disabling SSR prevents Next.js hydration compilation errors caused by third-party canvas engines
const AppointmentsCalendar = dynamic(
  () => import("@/features/appointments/components/appointments-calendar"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[70vh] items-center justify-center text-slate-400 text-sm">
        Initializing schedule environment...
      </div>
    ),
  }
);

export default function CalendarPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      <AppointmentsCalendar />
    </div>
  );
}