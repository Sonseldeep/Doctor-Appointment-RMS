"use client";

import { Doctor } from "../types/doctor.types";
import { Button } from "@/components/ui/button";
import {
  RiUserHeartLine,
  RiStarFill,
  RiTimeLine,
} from "@remixicon/react";

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  const fullName = `${doctor.firstName} ${doctor.lastName}`;

  return (
    <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition">
      <div className="flex gap-4">
        {/* Doctor Photo */}
        <div className="flex-shrink-0">
          {doctor.profilePhotoUrl ? (
            <img
              src={doctor.profilePhotoUrl}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl">
              <RiUserHeartLine className="text-blue-600" size={28} />
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Dr. {fullName}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">
                ₹{doctor.consultationFee}
              </p>
              <p className="text-xs text-muted-foreground">Consultation Fee</p>
            </div>
          </div>

          {/* Bio */}
          {doctor.bio && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {doctor.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
            {doctor.rating && (
              <span>
                <RiStarFill className="text-yellow-500 inline" size={14} /> {doctor.rating} ({doctor.reviewCount || 0} reviews)
              </span>
            )}
            {doctor.experience && (
              <span>
                <RiTimeLine className="text-blue-500 inline" size={14} /> {doctor.experience} years experience
              </span>
            )}
          </div>

          {/* Select Button */}
          <Button
            onClick={() => onSelect(doctor)}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}