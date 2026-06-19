"use client";

import { Doctor } from "../types/doctor.types";
import { Button } from "@/components/ui/button";
import { RiUserHeartLine, RiStarFill, RiTimeLine } from "@remixicon/react";
import { useDoctorRatings } from "@/features/ratings/hooks/use-doctor-ratings";

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  
  // Fetch real dynamic rating data
  const { data: ratingData, isLoading: isLoadingRatings } = useDoctorRatings(doctor.userId);

  // Use the API data if available, fallback to 0 instead of random numbers
  const displayRating = ratingData?.summary?.averageRating ? Number(ratingData.summary.averageRating).toFixed(1) : "0.0";
  const displayReviews = ratingData?.summary?.totalRatings ?? 0;
  
  // Experience is still safe fallback if not provided by backend
  const displayExperience = doctor.experience ?? 10;

  return (
    <div 
      onClick={() => onSelect(doctor)}
      className="flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition duration-200 cursor-pointer group select-none h-full"
    >
      <div>
        {/* Profile Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">
              {fullName}
            </h3>
            <p className="text-sm font-medium text-slate-500 line-clamp-1">
              {doctor.specialization}
            </p>
          </div>

          {/* Avatar Image Frame */}
          <div className="relative flex-shrink-0 w-14 h-14 bg-slate-50 border border-slate-100 rounded-full overflow-hidden flex items-center justify-center text-slate-400">
            {doctor.profilePhotoUrl ? (
              <img
                src={doctor.profilePhotoUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                <RiUserHeartLine className="text-blue-600" size={24} />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Badges Block */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <RiStarFill className="text-amber-400" size={15} /> 
            {isLoadingRatings ? (
              <span className="w-16 h-4 bg-slate-100 animate-pulse rounded"></span>
            ) : (
              <>
                <span className="text-slate-800 font-semibold">{displayRating}</span> 
                <span>({displayReviews} reviews)</span>
              </>
            )}
          </span>
          <span className="flex items-center gap-1">
            <RiTimeLine className="text-blue-500" size={15} /> 
            <span>{displayExperience} years experience</span>
          </span>
        </div>

        {/* Clinical Biography */}
        <p className="mt-4 text-xs leading-relaxed text-slate-600 line-clamp-2 italic">
          {doctor.bio && doctor.bio !== "string" ? `"${doctor.bio}"` : '"Committed to providing compassionate and comprehensive patient care."'}
        </p>
      </div>

      {/* Footer / Selector Block */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Consultation Fee</p>
          <p className="text-lg font-bold text-slate-900">${Number(doctor.consultationFee).toFixed(2)}</p>
        </div>
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(doctor);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl flex items-center gap-1 transition shadow-sm hover:shadow"
        >
          <span>Select</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}