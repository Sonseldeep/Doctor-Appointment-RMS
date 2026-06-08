"use client";

import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/features/appointments/api/appointments-api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { Button } from "@/components/ui/button";

export function DoctorDashboard() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", "doctor"],
    queryFn: appointmentsApi.getMyAppointments,  // ← Same endpoint, returns doctor's appointments
  });

  const pending = appointments?.filter(apt => apt.status === "Pending").length || 0;
  const confirmed = appointments?.filter(apt => apt.status === "Confirmed").length || 0;
  const completed = appointments?.filter(apt => apt.status === "Completed").length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Appointments</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold">{pending}</p>
          </div>
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-semibold">{confirmed}</p>
          </div>
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold">{completed}</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <p>Loading appointments...</p>
      ) : appointments?.length ? (
        <div className="space-y-2">
          {appointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No appointments</p>
      )}
    </div>
  );
}