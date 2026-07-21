"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { AvailabilityManager } from "@/features/availability/components/availability-manager";
import { RiTimeLine } from "@remixicon/react";

export default function AvailabilityPage() {
  const { data: user } = useCurrentUser();

  if (user?.role !== "Doctor") {
    return null; 
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <RiTimeLine className="w-6 h-6 text-blue-600" />
            Manage Availability
          </h1>
          <p className="text-sm text-slate-500">
            Configure your schedule blocks, set session lengths, and publish open consultation slots.
          </p>
        </div>

        <main className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
          <AvailabilityManager />
        </main>
      </div>
    </DashboardLayout>
  );
}