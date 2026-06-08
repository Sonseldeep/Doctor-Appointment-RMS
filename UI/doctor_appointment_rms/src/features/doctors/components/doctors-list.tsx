"use client";

import { useState } from "react";
import { Doctor } from "../types/doctor.types";
import { DoctorCard } from "./doctor-card";
import { Input } from "@/components/ui/input";

interface DoctorsListProps {
  doctors: Doctor[];
  isLoading: boolean;
  onSelectDoctor: (doctor: Doctor) => void;
}

export function DoctorsList({
  doctors,
  isLoading,
  onSelectDoctor,
}: DoctorsListProps) {
  const [searchSpecialization, setSearchSpecialization] = useState("");

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialization
      .toLowerCase()
      .includes(searchSpecialization.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <Input
          placeholder="Search by specialization (e.g., Cardiology)..."
          value={searchSpecialization}
          onChange={(e) => setSearchSpecialization(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Doctors Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.doctorProfileId}
              doctor={doctor}
              onSelect={onSelectDoctor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found</p>
        </div>
      )}
    </div>
  );
}