"use client";

import { useState } from "react";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";
import { DoctorsList } from "@/features/doctors/components/doctors-list";
import { BookAppointmentForm } from "@/features/appointments/components/book-appointment-form";
import { Doctor } from "@/features/doctors/types/doctor.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { data: doctors, isLoading } = useDoctors();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground mt-2">
          Find and select a doctor to book your appointment
        </p>
      </div>

      <DoctorsList
        doctors={doctors || []}
        isLoading={isLoading}
        onSelectDoctor={setSelectedDoctor}
      />

      {/* Booking Dialog */}
      <Dialog
        open={!!selectedDoctor}
        onOpenChange={(open) => {
          if (!open) setSelectedDoctor(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Book Appointment with Dr. {selectedDoctor?.firstName}{" "}
              {selectedDoctor?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <BookAppointmentForm
              preFilledDoctorId={selectedDoctor.userId}
              onSuccess={() => {
                setSelectedDoctor(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}