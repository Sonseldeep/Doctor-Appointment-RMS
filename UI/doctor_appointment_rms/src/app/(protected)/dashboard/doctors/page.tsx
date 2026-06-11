"use client";

import { useRouter } from "next/navigation";
import { DoctorsList } from "@/features/doctors/components/doctors-list";
import { Doctor } from "@/features/doctors/types/doctor.types";

export default function FindADoctorPage() {
  const router = useRouter();

  const handleSelectDoctor = (doctor: Doctor) => {
    // FIX: Changed from doctorProfileId to userId to match the database foreign key context
    console.log("Successfully selected doctor user instance ID:", doctor.userId);
    
    // Redirects the user to your booking screen, passing the selected doctor's User ID in the URL
    router.push(`/dashboard/appointments/book?doctorId=${doctor.userId}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find a Doctor</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse available clinical professionals, filter by core medical fields, or search by provider name tags.
        </p>
      </div>

      {/* Renders your live, server-filtered query search component block */}
      <DoctorsList onSelectDoctor={handleSelectDoctor} />
    </div>
  );
}