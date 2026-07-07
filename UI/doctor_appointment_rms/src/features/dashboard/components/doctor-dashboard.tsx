"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/features/appointments/api/appointments-api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";

export function DoctorDashboard() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", "doctor"],
    queryFn: () => appointmentsApi.getMyAppointments(1, 10),
  });

  const appointmentsList = Array.isArray(appointments) 
    ? appointments 
    : (appointments as any)?.items || [];

  const pending = appointmentsList.filter((apt: any) => apt.status === "Pending").length || 0;
  const confirmed = appointmentsList.filter((apt: any) => apt.status === "Confirmed").length || 0;
  const completed = appointmentsList.filter((apt: any) => apt.status === "Completed").length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Appointments Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-5 bg-white shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">Pending Requests</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pending}</p>
          </div>
          <div className="rounded-xl border p-5 bg-white shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">Confirmed Shifts</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{confirmed}</p>
          </div>
          <div className="rounded-xl border p-5 bg-white shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">Completed Visits</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{completed}</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Patient Queue</h3>
        {isLoading ? (
          <p className="text-sm text-slate-500 animate-pulse">Loading active clinical timeline...</p>
        ) : appointmentsList.length ? (
          <div className="space-y-2">
            {appointmentsList.map((apt: any) => (
              <AppointmentCard key={apt.id} appointment={apt} isDoctorView={true}/>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm border-2 border-dashed rounded-xl py-8 text-center bg-slate-50">
            No patient sessions booked for this timeline slice.
          </p>
        )}
      </div>
    </div>
  );
}