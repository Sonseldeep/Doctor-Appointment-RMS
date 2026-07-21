"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorsList } from "@/features/doctors/components/doctors-list";
import { Doctor } from "@/features/doctors/types/doctor.types";
import { DoctorProfileView } from "@/features/doctors/components/doctor-profile-view";
import { Button } from "@/components/ui/button";

export default function FindADoctorPage() {
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);

  const handleSelectDoctor = (doctor: Doctor) => {
    console.log("Successfully selected doctor user instance ID:", doctor.userId);

    setSelectedDoctor(doctor);
  };

  const handleProceedToBooking = () => {
    if (!selectedDoctor) return;
    router.push(`/dashboard/appointments/book?doctorId=${selectedDoctor.userId}`);
  };

  
  if (selectedDoctor) {
    return (
      <div className="p-6">
        <DoctorProfileView 
          doctor={selectedDoctor}
          onBack={() => setSelectedDoctor(null)} 
          onProceedToBooking={handleProceedToBooking} 
        />
      </div>
    );
  }

  
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find a Doctor</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse available clinical professionals, filter by core medical fields, or search by provider name tags.
        </p>
      </div>

      
      <DoctorsList 
      page={page} 
      pageSize={pageSize}
      onSelectDoctor={handleSelectDoctor} />

      
      <div className="flex justify-between items-center mt-6">
        <Button 
          variant="outline" 
          disabled={page === 1} 
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">Page {page}</span>
        <Button 
          variant="outline" 
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}