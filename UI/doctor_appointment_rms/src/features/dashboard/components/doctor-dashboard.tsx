"use client";

import { useState } from "react"; // Added to manage tabs
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/features/appointments/api/appointments-api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { AvailabilityManager } from "@/features/availability/components/availability-manager"; // Imported Manager
import { RiCalendarLine, RiTimeLine } from "@remixicon/react"; // Clean workspace UI icons

export function DoctorDashboard() {
  // Tab control: "appointments" or "availability"
  const [activeTab, setActiveTab] = useState<"appointments" | "availability">("appointments");

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", "doctor"],
    queryFn: appointmentsApi.getMyAppointments,  
  });

  const pending = appointments?.filter(apt => apt.status === "Pending").length || 0;
  const confirmed = appointments?.filter(apt => apt.status === "Confirmed").length || 0;
  const completed = appointments?.filter(apt => apt.status === "Completed").length || 0;

  return (
    <div className="space-y-6">
      {/* PROFESSIONAL TAB HEADER TOGGLE */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
            activeTab === "appointments"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <RiCalendarLine size={18} />
          Appointments Schedule
        </button>
        <button
          onClick={() => setActiveTab("availability")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
            activeTab === "availability"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <RiTimeLine size={18} />
          Manage My Availability
        </button>
      </div>

      {/* VIEW PANEL CONDITIONAL ROUTING */}
      {activeTab === "appointments" ? (
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
            ) : appointments?.length ? (
              <div className="space-y-2">
                {appointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} 
                    isDoctorView={true}/>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm border-2 border-dashed rounded-xl py-8 text-center bg-slate-50">
                No patient sessions booked for this timeline slice.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Renders our customized, CRUD-connected schedule block generator */
        <div className="pt-2">
          <AvailabilityManager />
        </div>
      )}
    </div>
  );
}