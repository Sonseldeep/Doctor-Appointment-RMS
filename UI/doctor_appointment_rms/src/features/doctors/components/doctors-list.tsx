"use client";

import { useState } from "react";
import { useDoctors } from "../hooks/use-doctors";
import { DoctorCard } from "./doctor-card";
import { Doctor } from "../types/doctor.types";
import { RiSearchLine, RiFilter3Line } from "@remixicon/react";

interface DoctorsListProps {
  onSelectDoctor: (doctor: Doctor) => void;
  page: number;
  pageSize: number;
}

export function DoctorsList({ onSelectDoctor, page, pageSize }: DoctorsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");

  const { data, isLoading, isError } = useDoctors({
    searchTerm,
    specialization,
    page, 
    pageSize,
  });

  const doctorsList = data?.items || [];

  return (
    <div className="space-y-6">
      {/* Search Input Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <RiSearchLine size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by specialty or provider name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 transition"
          />
        </div>

        <div className="relative min-w-[180px]">
          <RiFilter3Line size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:border-blue-500 text-slate-700 transition cursor-pointer"
          >
            <option value="">All Specializations</option>
            <option value="General">General</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Orthopedic">Orthopedic</option>
          </select>
        </div>
      </div>

      {/* Grid Layout State Processor */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((skeletonIndex) => (
            <div key={skeletonIndex} className="h-60 border border-slate-100 rounded-xl bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-800 text-sm font-medium border border-red-100 text-center">
          Failed to fetch medical practitioner records list. Check back momentarily.
        </div>
      ) : doctorsList.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {doctorsList.map((doctor) => (
            <DoctorCard
              key={doctor.doctorProfileId}
              doctor={doctor}
              onSelect={onSelectDoctor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50/50 text-muted-foreground">
          <p className="font-semibold text-slate-700 text-sm">No medical practitioners found</p>
          <p className="text-xs text-slate-400 mt-1">Try broadening your input tracking parameters or category filters.</p>
        </div>
      )}
    </div>
  );
}