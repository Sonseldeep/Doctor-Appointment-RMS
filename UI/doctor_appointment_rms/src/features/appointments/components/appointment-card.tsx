"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiCalendarLine, RiMessage2Line } from "@remixicon/react";
import { RatingModal } from "@/features/ratings/components/rating-modal";

interface ExtendedAppointment {
  id: string;
  patientUserId: string;
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  status: string;
  notes: string | null;
  doctorName: string;
  doctorNmcNumber?: string;
  doctorPhotoUrl: string | null;
  doctorSpecialization: string;
  patientName: string;
  patientSex: string;
  patientAge: number;
  patientPhotoUrl: string | null;
}

interface AppointmentCardProps {
  appointment: any; 
  onCancel?: (id: string) => void;
  onClick?: () => void;
  isDoctorView?: boolean; 
}

export function AppointmentCard({ appointment, onCancel, onClick, isDoctorView = false }: AppointmentCardProps) {
  
  const apt = appointment as ExtendedAppointment;
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  
  const date = new Date(apt.startUtc);
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: true });

  const statusColor = {
    Scheduled: "bg-blue-50 text-blue-700 border-blue-100",
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Completed: "bg-green-50 text-green-700 border-green-100",
    Cancelled: "bg-red-50 text-red-600 border-red-100/60",
  }[apt.status] || "bg-slate-50 text-slate-700 border-slate-100";

  
  const displayName = isDoctorView
    ? (apt.patientName || "Patient")
    : (apt.doctorName ? `Dr. ${apt.doctorName}` : "Medical Practitioner");

  
  const displaySubtitle = isDoctorView
    ? [apt.patientSex, apt.patientAge ? `${apt.patientAge} yrs` : null].filter(Boolean).join(", ") || "Patient Profile"
    : (apt.doctorSpecialization || "General Practitioner");

  
  const displayAvatarUrl = isDoctorView 
    ? apt.patientPhotoUrl 
    : apt.doctorPhotoUrl;

  const getInitials = (name: string) => 
    name.replace("Dr. ", "").split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "MD";

  return (
    <>
      <div 
        onClick={onClick}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition duration-200 cursor-pointer select-none group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              {/* Profile Image Wrap */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-inner">
                {displayAvatarUrl ? (
                  <img 
                    src={displayAvatarUrl} 
                    alt={displayName} 
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <span className="text-sm font-bold text-blue-600 tracking-wider">
                    {getInitials(displayName)}
                  </span>
                )}
              </div>
              
              <div>
                <p className="font-bold text-base text-slate-900 tracking-tight transition-colors group-hover:text-blue-600">
                  {displayName}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {displaySubtitle}
                </p>
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
            {apt.status}
          </span>
        </div>

        {/* Schedule Timing tag */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50/50 p-2 rounded-lg w-fit border border-slate-100/50 mt-4">
          <RiCalendarLine size={14} className="text-slate-400" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>

        {/* Consultation Notes */}
        {apt.notes && (
          <div className="mt-4 p-4 bg-blue-50/40 border border-blue-100/40 rounded-xl text-sm text-slate-700 italic font-medium transition-colors group-hover:bg-blue-50/60">
            <span className="font-black text-blue-600 flex items-center gap-1.5 mb-1.5 not-italic text-[10px] uppercase tracking-wider">
              <RiMessage2Line size={12} /> {isDoctorView ? "Patient Notes:" : "Your notes:"}
            </span>
            "{apt.notes}"
          </div>
        )}

        {/* Action Triggers */}
        <div className="flex gap-3 mt-5" onClick={(e) => e.stopPropagation()}>
          

          {!isDoctorView && apt.status === "Completed" && (
            <Button 
              size="sm" 
              className="flex-1 rounded-xl font-semibold text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setIsRatingModalOpen(true)}
            >
              Leave Review
            </Button>
          )}
        </div>
      </div>

      {/* Linked Rating Modal */}
      {!isDoctorView && (
        <RatingModal 
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          appointment={appointment} 
        />
      )}
    </>
  );
}