"use client";

import { Appointment } from "../types/appointments.types";
import { Button } from "@/components/ui/button";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const date = new Date(appointment.startUtc);
  const formattedDate = date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
  const formattedTime = date.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  const statusColor = {
    Scheduled: "bg-blue-100 text-blue-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  }[appointment.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="rounded-xl border bg-white p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">👨‍⚕️</span>
            <div>
              <p className="font-semibold text-lg">Dr. {appointment.doctorName || appointment.doctorUserId}</p>
              {appointment.specialty && (
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              )}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {appointment.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{formattedDate} at {formattedTime}</span>
        </div>

        {appointment.location && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{appointment.location}</span>
          </div>
        )}

        {appointment.appointmentType && (
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
              {appointment.appointmentType}
            </span>
          </div>
        )}

        {appointment.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <p><strong>Notes:</strong> {appointment.notes}</p>
          </div>
        )}
      </div>

      {appointment.status === "Scheduled" && (
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            Reschedule
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600 hover:text-red-700"
            onClick={() => onCancel?.(appointment.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}