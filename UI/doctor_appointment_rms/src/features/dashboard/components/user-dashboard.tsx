"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/features/appointments/api/appointments-api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { BookAppointmentForm } from "@/features/appointments/components/book-appointment-form";
import { StatCard } from "./stat-card";
import { HealthAlerts } from "./health-alerts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export function UserDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["appointments", "user"],
    queryFn: appointmentsApi.getMyAppointments,
  });

  const upcoming = appointments?.filter(
    apt => apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
  ).length || 0;
  const completed = appointments?.filter(apt => apt.status === "Completed").length || 0;
  const cancelled = appointments?.filter(apt => apt.status === "Cancelled").length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your healthcare
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Appointments"
          value={upcoming}
          icon="📅"
          backgroundColor="bg-blue-50"
        />
        <StatCard
          title="Completed Appointments"
          value={completed}
          icon="✅"
          trend={12}
          backgroundColor="bg-green-50"
        />
        <StatCard
          title="Active Prescriptions"
          value={3}
          icon="💊"
          backgroundColor="bg-purple-50"
        />
        <StatCard
          title="Medical Reports"
          value={8}
          icon="📋"
          backgroundColor="bg-orange-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Book New
            </Button>
          </div>

          {isLoading ? (
            <div className="rounded-xl border p-8 text-center">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : appointments?.filter(apt => 
            apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
          ).length ? (
            <div className="space-y-3">
              {appointments
                .filter(apt => 
                  apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
                )
                .slice(0, 5) // Show top 5
                .map(apt => (
                  <AppointmentCard 
                    key={apt.id} 
                    appointment={apt}
                    onCancel={() => {
                      // Handle cancel logic
                      refetch();
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="mt-4"
              >
                Book your first appointment
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Alerts & Quick Actions */}
        <div className="space-y-6">
          <HealthAlerts />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
            <Button className="w-full bg-gray-900 hover:bg-gray-800" variant="default">
              📅 Book Appointment
            </Button>
            <Button variant="outline" className="w-full">
              📋 View Medical Records
            </Button>
            <Button variant="outline" className="w-full">
              💊 View Prescriptions
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
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