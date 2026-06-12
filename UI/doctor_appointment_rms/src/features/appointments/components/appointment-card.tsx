// "use client";

// import { Appointment } from "../types/appointments.types";
// import { Button } from "@/components/ui/button";
// import { RiUserHeartLine, RiCalendarLine } from "@remixicon/react";
// import { toast } from "sonner";
// // EXTENDED INTERFACE: Combines flat types and nested API shapes to clear all TS compiler errors
// interface ExtendedAppointment extends Appointment {
//   patientName?: string;
//   patientSex?: string;
//   patientAge?: number;
//   patient?: {
//     firstName?: string;
//     lastName?: string;
//     sex?: string;
//     age?: number;
//   };
// }

// interface AppointmentCardProps {
//   appointment: ExtendedAppointment;
//   onCancel?: (id: string) => void;
//   onClick?: () => void;
// }

// export function AppointmentCard({ appointment, onCancel, onClick }: AppointmentCardProps) {
//   // FIX: Parse as UTC to prevent browser-based timezone shifting
//   const date = new Date(appointment.startUtc);
  
//   const formattedDate = date.toLocaleDateString("en-US", { 
//     month: "short", 
//     day: "numeric", 
//     year: "numeric",
//     timeZone: "UTC" 
//   });
  
//   const formattedTime = date.toLocaleTimeString("en-US", { 
//     hour: "2-digit", 
//     minute: "2-digit",
//     timeZone: "UTC",
//     hour12: true
//   });

//   const statusColor = {
//     Scheduled: "bg-blue-100 text-blue-800",
//     Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
//     Pending: "bg-yellow-100 text-yellow-800",
//     Completed: "bg-green-100 text-green-800",
//     Cancelled: "bg-red-100 text-red-800",
//   }[appointment.status] || "bg-gray-100 text-gray-800";

//   // PRIORITIZE DOCTOR INFO FOR PATIENT DASHBOARD
//   const doctorDisplayName = appointment.doctorName ? `Dr. ${appointment.doctorName}` : "Practitioner";
//   const doctorSpecialization = appointment.doctorSpecialization || "General";
  

//   return (
//     <div 
//       onClick={onClick}
//       className="rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition cursor-pointer select-none"
//     >
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex-1">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-50 rounded-lg">
//               <RiUserHeartLine size={20} className="text-blue-600" />
//             </div>
//             <div>
//               <p className="font-semibold text-lg">{doctorDisplayName}</p>
//               <p className="text-sm text-muted-foreground">{doctorSpecialization}</p>
//             </div>
//           </div>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
//           {appointment.status}
//         </span>
//       </div>

//       <div className="space-y-3 text-sm mt-4">
//         <div className="flex items-center gap-2 text-slate-600">
//           <RiCalendarLine size={16} />
//           <span className="font-medium">{formattedDate} at {formattedTime}</span>
//         </div>

//         {appointment.notes && (
//           <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 italic">
//             <span className="font-bold text-blue-700 block mb-1 not-italic text-xs uppercase tracking-wider">
//               Your notes:
//             </span>
//             "{appointment.notes}"
//           </div>
//         )}
//       </div>

//       {["Scheduled", "Confirmed", "Pending"].includes(appointment.status) && (
//         <div className="flex gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
//           <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
//             onClick={() => onCancel?.(appointment.id)}
//           >
//             Cancel
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { Appointment } from "../types/appointments.types";
// import { Button } from "@/components/ui/button";
// import { RiUserHeartLine, RiCalendarLine } from "@remixicon/react";

// // EXTENDED INTERFACE: Combines flat types and nested API shapes to clear all TS compiler errors
// interface ExtendedAppointment extends Appointment {
//   patientName?: string;
//   patientSex?: string;
//   patientAge?: number;
//   patient?: {
//     firstName?: string;
//     lastName?: string;
//     sex?: string;
//     age?: number;
//   };
// }

// interface AppointmentCardProps {
//   appointment: ExtendedAppointment;
//   onCancel?: (id: string) => void;
//   onClick?: () => void;
// }

// export function AppointmentCard({ appointment, onCancel, onClick }: AppointmentCardProps) {
//   // FIX: Parse as UTC to prevent browser-based timezone shifting
//   const date = new Date(appointment.startUtc);
  
//   const formattedDate = date.toLocaleDateString("en-US", { 
//     month: "short", 
//     day: "numeric", 
//     year: "numeric",
//     timeZone: "UTC" 
//   });
  
//   const formattedTime = date.toLocaleTimeString("en-US", { 
//     hour: "2-digit", 
//     minute: "2-digit",
//     timeZone: "UTC",
//     hour12: true
//   });

//   const statusColor = {
//     Scheduled: "bg-blue-100 text-blue-800",
//     Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
//     Pending: "bg-yellow-100 text-yellow-800",
//     Completed: "bg-green-100 text-green-800",
//     Cancelled: "bg-red-100 text-red-800",
//   }[appointment.status] || "bg-gray-100 text-gray-800";

//   // PRIORITIZE DOCTOR INFO FOR PATIENT DASHBOARD
//   const doctorDisplayName = appointment.doctorName ? `Dr. ${appointment.doctorName}` : "Practitioner";
//   const doctorSpecialization = appointment.doctorSpecialization || "General";

//   return (
//     <div 
//       onClick={onClick}
//       className="rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition cursor-pointer select-none"
//     >
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex-1">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-50 rounded-lg">
//               <RiUserHeartLine size={20} className="text-blue-600" />
//             </div>
//             <div>
//               <p className="font-semibold text-lg">{doctorDisplayName}</p>
//               <p className="text-sm text-muted-foreground">{doctorSpecialization}</p>
//             </div>
//           </div>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
//           {appointment.status}
//         </span>
//       </div>

//       <div className="space-y-3 text-sm mt-4">
//         <div className="flex items-center gap-2 text-slate-600">
//           <RiCalendarLine size={16} />
//           <span className="font-medium">{formattedDate} at {formattedTime}</span>
//         </div>

//         {appointment.notes && (
//           <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 italic">
//             <span className="font-bold text-blue-700 block mb-1 not-italic text-xs uppercase tracking-wider">
//               Your notes:
//             </span>
//             "{appointment.notes}"
//           </div>
//         )}
//       </div>

//       {["Scheduled", "Confirmed", "Pending"].includes(appointment.status) && (
//         <div className="flex gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
//           <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
//             onClick={() => onCancel?.(appointment.id)}
//           >
//             Cancel
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Appointment } from "../types/appointments.types";
import { Button } from "@/components/ui/button";
import { RiUserHeartLine, RiCalendarLine, RiUserLine } from "@remixicon/react";

// EXTENDED INTERFACE: Combines flat types and nested API shapes to clear all TS compiler errors
interface ExtendedAppointment extends Appointment {
  patientName?: string;
  patientSex?: string;
  patientAge?: number;
  patientImageUrl?: string; // Added to support patient avatar strings
  patient?: {
    firstName?: string;
    lastName?: string;
    sex?: string;
    age?: number;
    profilePicture?: string; // Added to support nested profile pictures
  };
}

interface AppointmentCardProps {
  appointment: ExtendedAppointment;
  onCancel?: (id: string) => void;
  onClick?: () => void;
  isDoctorView?: boolean; // NEW PROP: Switches layout context between patient and doctor dashboards
}

export function AppointmentCard({ appointment, onCancel, onClick, isDoctorView = false }: AppointmentCardProps) {
  // FIX: Parse as UTC to prevent browser-based timezone shifting
  const date = new Date(appointment.startUtc);
  
  const formattedDate = date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric",
    timeZone: "UTC" 
  });
  
  const formattedTime = date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true
  });

  const statusColor = {
    Scheduled: "bg-blue-100 text-blue-800",
    Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  }[appointment.status] || "bg-gray-100 text-gray-800";

  // DYNAMIC TEXT RESOLUTION BASED ON VIEW CONTEXT
  const displayName = isDoctorView
    ? appointment.patientName || (appointment.patient?.firstName ? `${appointment.patient.firstName} ${appointment.patient.lastName || ""}`.trim() : "Patient")
    : appointment.doctorName ? `Dr. ${appointment.doctorName}` : "Practitioner";

  const displaySubtitle = isDoctorView
    ? [appointment.patientSex, appointment.patientAge ? `${appointment.patientAge} yrs` : null].filter(Boolean).join(", ") || "Patient Profile"
    : appointment.doctorSpecialization || "General";

  // DYNAMIC AVATAR IMAGE RESOLUTION 
  const displayAvatarUrl = isDoctorView 
    ? (appointment.patientImageUrl || appointment.patient?.profilePicture)
    : null;

  return (
    <div 
      onClick={onClick}
      className="rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition cursor-pointer select-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* DP SECTION: Displays profile picture image if available, else falls back to beautiful placeholder icon */}
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
              {displayAvatarUrl ? (
                <img 
                  src={displayAvatarUrl} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                />
              ) : isDoctorView ? (
                <RiUserLine size={20} className="text-blue-600" />
              ) : (
                <RiUserHeartLine size={20} className="text-blue-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-lg text-slate-900">{displayName}</p>
              <p className="text-sm text-muted-foreground">{displaySubtitle}</p>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          {appointment.status}
        </span>
      </div>

      <div className="space-y-3 text-sm mt-4">
        <div className="flex items-center gap-2 text-slate-600">
          <RiCalendarLine size={16} />
          <span className="font-medium">{formattedDate} at {formattedTime}</span>
        </div>

        {appointment.notes && (
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 italic">
            <span className="font-bold text-blue-700 block mb-1 not-italic text-xs uppercase tracking-wider">
              Your notes:
            </span>
            "{appointment.notes}"
          </div>
        )}
      </div>

      {["Scheduled", "Confirmed", "Pending"].includes(appointment.status) && (
        <div className="flex gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            onClick={() => onCancel?.(appointment.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}