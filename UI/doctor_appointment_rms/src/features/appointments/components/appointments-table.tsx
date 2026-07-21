"use client";

import { RiCalendarLine, RiTimeLine, RiUserLine, RiErrorWarningLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Appointment } from "@/features/appointments/types/appointments.types";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  scheduled: "bg-indigo-100 text-indigo-800 border-indigo-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export function getStatusBadgeClass(status?: string) {
  return STATUS_STYLES[status?.toLowerCase() ?? ""] ?? "bg-slate-100 text-slate-700 border-slate-200";
}

// Compares calendar dates in UTC (matches the UTC display used throughout this page).
export function isPastDate(startUtc: string) {
  const apt = new Date(startUtc);
  const today = new Date();
  const aptKey = Date.UTC(apt.getUTCFullYear(), apt.getUTCMonth(), apt.getUTCDate());
  const todayKey = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return aptKey < todayKey;
}

const NON_FINISHED_CANCELLABLE: ReadonlyArray<string> = ["Pending", "Scheduled", "Confirmed"];

interface AppointmentsTableProps {
  appointments: Appointment[];
  isDoctor: boolean;
  startIndex: number;
  targetAppointmentId?: string | null;
  onView: (apt: Appointment) => void;
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
}

export function AppointmentsTable({
  appointments,
  isDoctor,
  startIndex,
  targetAppointmentId,
  onView,
  onCancel,
  onConfirm,
}: AppointmentsTableProps) {
  return (
    <Table>
      <TableHeader className="bg-slate-50 border-b border-slate-200">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-12 text-center font-semibold text-slate-700 h-11">S.N</TableHead>
          <TableHead className="font-semibold text-slate-700 h-11">
            {isDoctor ? "Patient Details" : "Doctor Details"}
          </TableHead>
          <TableHead className="font-semibold text-slate-700 h-11">Schedule Date & Time</TableHead>
          <TableHead className="font-semibold text-slate-700 h-11">Current Status</TableHead>
          <TableHead className="font-semibold text-slate-700 h-11 text-right pr-10">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((apt, index) => {
          const globalIndex = startIndex + index + 1;
          const avatarUrl = isDoctor ? (apt as any).patientPhotoUrl : (apt as any).doctorPhotoUrl;
          const displayName = isDoctor ? apt.patientName ?? "Unknown Patient" : `Dr. ${apt.doctorName ?? "Unknown"}`;
          const isHighlighted = apt.id === targetAppointmentId;
          const overdue = isPastDate(apt.startUtc) && !["completed", "cancelled"].includes(apt.status?.toLowerCase());

          return (
            <TableRow
              key={apt.id}
              className={`group transition-all duration-300 ${
                isHighlighted
                  ? "bg-blue-50/60 hover:bg-blue-50/80 ring-1 ring-inset ring-blue-100"
                  : "hover:bg-slate-50/50 transition-colors"
              }`}
            >
              <TableCell
                className={`py-3 text-center text-sm font-medium transition-all ${
                  isHighlighted ? "text-blue-600 font-bold border-l-4 border-l-blue-500" : "text-slate-400"
                }`}
              >
                {globalIndex}
              </TableCell>

              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/80 shadow-sm flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <RiUserLine size={18} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm ${
                        isHighlighted ? "text-blue-700" : ""
                      }`}
                    >
                      {displayName}
                    </span>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      {isDoctor ? (
                        <>
                          <span className="font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                            {apt.patientSex || "N/A"}
                          </span>
                          <span>•</span>
                          <span>{apt.patientAge ? `${apt.patientAge} Yrs` : "Age N/A"}</span>
                        </>
                      ) : (
                        <span className="text-blue-600 font-medium text-[11px]">
                          {apt.doctorSpecialization || apt.specialty || "General Medicine"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <RiCalendarLine size={14} className="text-slate-400" />
                  {new Date(apt.startUtc).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <RiTimeLine size={14} className="text-slate-400" />
                  {new Date(apt.startUtc).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                  {overdue && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 uppercase">
                      <RiErrorWarningLine size={12} /> Overdue
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell className="py-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(
                    apt.status
                  )}`}
                >
                  {apt.status}
                </span>
              </TableCell>

              <TableCell className="py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 text-xs font-medium text-slate-600 hover:text-slate-900 ${
                      isHighlighted ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-slate-50 hover:bg-slate-100"
                    }`}
                    onClick={() => onView(apt)}
                  >
                    View
                  </Button>

                  {isDoctor && apt.status === "Pending" && (
                    <Button
                      size="sm"
                      className="h-8 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => onConfirm(apt.id)}
                    >
                      Confirm
                    </Button>
                  )}

                  {!isDoctor && NON_FINISHED_CANCELLABLE.includes(apt.status) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => onCancel(apt.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}