"use client";

import { Appointment } from "../types/appointments.types";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const date = new Date(appointment.startUtc);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  }[appointment.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="rounded-xl border p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-sm">
            {appointment.patientUserId === "current-user-id" 
              ? `Dr. ${appointment.doctorUserId}` 
              : `Patient: ${appointment.patientUserId}`}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {formattedDate} at {formattedTime}
          </p>
          {appointment.notes && (
            <p className="text-sm mt-2 text-gray-600">{appointment.notes}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {appointment.status}
        </span>
      </div>
    </div>
  );
}