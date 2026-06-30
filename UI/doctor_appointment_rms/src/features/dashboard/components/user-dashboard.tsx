"use client";

import { useRouter } from "next/navigation";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { StatCard } from "./stat-card";
import { FollowUpList } from "./follow-up-list";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
import {
  RiCalendarLine,
  RiCheckLine,
  RiTimeLine,
  RiHistoryLine,
  RiCalendar2Line,
  RiFileListLine,
  RiCapsuleLine,
} from "@remixicon/react";

export function UserDashboard() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  
  const { data: pagedData, isLoading, refetch } = useGetMyAppointments(1, 10);
  
  const appointments = pagedData?.items || [];

  const upcomingCount = appointments?.filter(
    apt => apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
  ).length || 0;

  const pendingCount = appointments?.filter(
    apt => apt.status === "Pending"
  ).length || 0;

  const completedCount = appointments?.filter(
    apt => apt.status === "Completed"
  ).length || 0;

  const totalLifetimeCount = appointments?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's a real-time overview of your medical schedules and status tracking.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Bookings"
          value={upcomingCount}
          icon={<RiCalendarLine />}
          backgroundColor="bg-blue-50/70"
        />
        <StatCard
          title="Awaiting Approval"
          value={pendingCount}
          icon={<RiTimeLine className="text-amber-600" />}
          backgroundColor="bg-amber-50/70"
        />
        <StatCard
          title="Completed Consults"
          value={completedCount}
          icon={<RiCheckLine className="text-emerald-600" />}
          backgroundColor="bg-emerald-50/70"
        />
        <StatCard
          title="Total Consultations"
          value={totalLifetimeCount}
          icon={<RiHistoryLine className="text-indigo-600" />}
          backgroundColor="bg-indigo-50/70"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Appointments Workspace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Active Consultations</h2>
          </div>

          {isLoading ? (
            <div className="rounded-xl border p-12 text-center text-sm text-muted-foreground animate-pulse bg-slate-50/30">
              Syncing appointment logs with clinic databases...
            </div>
          ) : appointments?.filter(apt => 
            apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
          ).length ? (
            <div className="space-y-3">
              {appointments
                .filter(apt => 
                  apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
                )
                .slice(0, 5) // Show top 5 items max to prevent vertical overload
                .map(apt => (
                  <AppointmentCard 
                    key={apt.id} 
                    appointment={apt}
                    onCancel={() => {
                      refetch();
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center bg-slate-50/20">
              <p className="text-muted-foreground text-sm font-medium">No upcoming or pending appointments active.</p>
              <Button
                onClick={() => router.push("dashboard/doctors")} // Redirects directly to the doctors page
                variant="outline"
                className="mt-4 border-slate-200 hover:bg-slate-50 shadow-sm"
              >
                Book your first consultation block
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - System Messages & Side Actions */}
        <div className="space-y-6">
          <FollowUpList />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg tracking-tight">Quick Dashboard Actions</h3>
            <Button 
              onClick={() => router.push("dashboard/doctors")} // Redirects directly to the doctors page
              className="w-full bg-slate-950 hover:bg-slate-900 shadow-sm transition-all" 
              variant="default"
            >
              <RiCalendar2Line className="mr-2 w-4 h-4" /> Book Appointment
            </Button>
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-not-allowed opacity-50">
              <RiFileListLine className="mr-2 w-4 h-4" /> View Records (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-not-allowed opacity-50">
              <RiCapsuleLine className="mr-2 w-4 h-4" /> View Prescriptions (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}