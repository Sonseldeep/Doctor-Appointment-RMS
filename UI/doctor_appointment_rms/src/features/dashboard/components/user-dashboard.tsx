"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/features/appointments/api/appointments-api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { BookAppointmentForm } from "@/features/appointments/components/book-appointment-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UserDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["appointments", "user"],
    queryFn: appointmentsApi.getMyAppointments,  //Changed to getMyAppointments
  });

  const upcoming = appointments?.filter(apt => apt.status === "Confirmed" || apt.status === "Pending").length || 0;
  const completed = appointments?.filter(apt => apt.status === "Completed").length || 0;
  const cancelled = appointments?.filter(apt => apt.status === "Cancelled").length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Appointments</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <p className="text-2xl font-semibold">{upcoming}</p>
          </div>
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold">{completed}</p>
          </div>
          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Cancelled</p>
            <p className="text-2xl font-semibold">{cancelled}</p>
          </div>
        </div>
      </div>

      {/* Book New Appointment Button */}
      <div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Book New Appointment
        </Button>
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
        <p className="text-muted-foreground">No appointments scheduled</p>
      )}

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
          </DialogHeader>
          <BookAppointmentForm
            onSuccess={() => {
              setIsDialogOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}