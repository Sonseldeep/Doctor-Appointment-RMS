// "use client";

// import { useState } from "react";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
// import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
// import { AppointmentCard } from "@/features/appointments/components/appointment-card";
// import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
// import { CancelConfirmationModal } from "@/features/appointments/components/cancel-confirmation-modal"; // Import new modal
// import { Appointment } from "@/features/appointments/types/appointments.types";
// import { RiAlertLine } from "@remixicon/react";

// export default function AppointmentsPage() {
//   const { data: user } = useCurrentUser();
//   const { data: myAppointments, isLoading, error, isError } = useGetMyAppointments();
//   const { mutate: cancelAppointment } = useCancelAppointment();
  
//   // State variables for popups
//   const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
//   const [cancelTargetId, setCancelTargetId] = useState<string | null>(null); // Track id to be canceled

//   const isDoctor = user?.role?.toLowerCase() === "doctor";
//   const safeAppointmentsArray = Array.isArray(myAppointments) ? myAppointments : (myAppointments as any)?.items || [];

//   // Triggers when user clicks 'Yes, Cancel It' inside the beautiful modal frame
//   const handleConfirmCancellation = () => {
//     if (!cancelTargetId) return;

//     cancelAppointment(cancelTargetId, {
//       onSuccess: () => {
//         if (activeAppointment?.id === cancelTargetId) {
//           setActiveAppointment(null);
//         }
//         setCancelTargetId(null); // Safely closes down confirmation view
//       },
//       onError: (err: any) => {
//         alert(`Could not cancel appointment: ${err?.response?.data?.message || err.message}`);
//         setCancelTargetId(null);
//       }
//     });
//   };

//   return (
//     <div className="space-y-6 max-w-5xl w-full mx-auto p-4">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//           {isDoctor ? "Patient Appointments Schedule" : "Your Appointment Dashboard"}
//         </h1>
//         <p className="text-muted-foreground mt-1 text-sm">
//           {isDoctor ? "Review clinical booking dates and diagnostic logs submitted by patients." : "Manage existing care sessions."}
//         </p>
//       </div>

//       {isError && (
//         <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
//           <RiAlertLine size={16} className="text-red-600 flex-shrink-0" />
//           <span>Failed to sync data records list: {error?.message}</span>
//         </div>
//       )}

//       {!isError && (
//         <div className="space-y-4">
//           {isLoading ? (
//             <div className="text-center py-12 text-sm text-muted-foreground font-medium animate-pulse">
//               Synchronizing production system ledger registers...
//             </div>
//           ) : safeAppointmentsArray.length > 0 ? (
//             <div className="grid grid-cols-1 gap-4">
//               {safeAppointmentsArray.map((appointment: Appointment) => (
//                 <AppointmentCard
//                   key={appointment.id}
//                   appointment={appointment}
//                   onClick={() => setActiveAppointment(appointment)}
//                   onCancel={(id) => setCancelTargetId(id)} // Open our new beautiful modal instead
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50/50 text-muted-foreground">
//               <p className="font-semibold text-gray-700 text-sm">No scheduled bookings recorded</p>
//               <p className="text-xs text-gray-400 mt-1">Your active dashboard ledger registry is currently empty.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Presentation View Modal */}
//       <AppointmentDetailsModal
//         appointment={activeAppointment}
//         isOpen={!!activeAppointment}
//         onClose={() => setActiveAppointment(null)}
//         isDoctor={isDoctor}
//       />

//       {/* Custom Core Cancellation Modal */}
//       <CancelConfirmationModal
//         isOpen={!!cancelTargetId}
//         onClose={() => setCancelTargetId(null)}
//         onConfirm={handleConfirmCancellation}
//       />
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
// import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
// import { AppointmentCard } from "@/features/appointments/components/appointment-card";
// import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
// import { CancelConfirmationModal } from "@/features/appointments/components/cancel-confirmation-modal"; // Import new modal
// import { Appointment } from "@/features/appointments/types/appointments.types";
// import { RiAlertLine } from "@remixicon/react";

// export default function AppointmentsPage() {
//   const { data: user } = useCurrentUser();
//   const { data: myAppointments, isLoading, error, isError } = useGetMyAppointments();
//   const { mutate: cancelAppointment } = useCancelAppointment();
  
//   // State variables for popups
//   const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
//   const [cancelTargetId, setCancelTargetId] = useState<string | null>(null); // Track id to be canceled

//   const isDoctor = user?.role?.toLowerCase() === "doctor";
//   const safeAppointmentsArray = Array.isArray(myAppointments) ? myAppointments : (myAppointments as any)?.items || [];

//   // Triggers when user clicks 'Yes, Cancel It' inside the beautiful modal frame
//   const handleConfirmCancellation = () => {
//     if (!cancelTargetId) return;

//     cancelAppointment(cancelTargetId, {
//       onSuccess: () => {
//         if (activeAppointment?.id === cancelTargetId) {
//           setActiveAppointment(null);
//         }
//         setCancelTargetId(null); // Safely closes down confirmation view
//       },
//       onError: (err: any) => {
//         alert(`Could not cancel appointment: ${err?.response?.data?.message || err.message}`);
//         setCancelTargetId(null);
//       }
//     });
//   };

//   return (
//     <div className="space-y-6 max-w-5xl w-full mx-auto p-4">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//           {isDoctor ? "Patient Appointments Schedule" : "Your Appointment Dashboard"}
//         </h1>
//         <p className="text-muted-foreground mt-1 text-sm">
//           {isDoctor ? "Review clinical booking dates and diagnostic logs submitted by patients." : "Manage existing care sessions."}
//         </p>
//       </div>

//       {isError && (
//         <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
//           <RiAlertLine size={16} className="text-red-600 flex-shrink-0" />
//           <span>Failed to sync data records list: {error?.message}</span>
//         </div>
//       )}

//       {!isError && (
//         <div className="space-y-4">
//           {isLoading ? (
//             <div className="text-center py-12 text-sm text-muted-foreground font-medium animate-pulse">
//               Synchronizing production system ledger registers...
//             </div>
//           ) : safeAppointmentsArray.length > 0 ? (
//             <div className="grid grid-cols-1 gap-4">
//               {safeAppointmentsArray.map((appointment: Appointment) => (
//                 <AppointmentCard
//                   key={appointment.id}
//                   appointment={appointment}
//                   onClick={() => setActiveAppointment(appointment)}
//                   onCancel={(id) => setCancelTargetId(id)} // Open our new beautiful modal instead
//                   isDoctorView={isDoctor} // 👈 Added this line here to automatically flip layouts
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50/50 text-muted-foreground">
//               <p className="font-semibold text-gray-700 text-sm">No scheduled bookings recorded</p>
//               <p className="text-xs text-gray-400 mt-1">Your active dashboard ledger registry is currently empty.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Presentation View Modal */}
//       <AppointmentDetailsModal
//         appointment={activeAppointment}
//         isOpen={!!activeAppointment}
//         onClose={() => setActiveAppointment(null)}
//         isDoctor={isDoctor}
//       />

//       {/* Custom Core Cancellation Modal */}
//       <CancelConfirmationModal
//         isOpen={!!cancelTargetId}
//         onClose={() => setCancelTargetId(null)}
//         onConfirm={handleConfirmCancellation}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { useConfirmAppointment } from "@/features/appointments/hooks/use-my-appointment";
import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
import { CancelConfirmationModal } from "@/features/appointments/components/cancel-confirmation-modal";
import { Appointment } from "@/features/appointments/types/appointments.types";
import { RiAlertLine, RiCalendarLine, RiTimeLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "scheduled":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "cancelled":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function AppointmentsPage() {
  const { data: user } = useCurrentUser();
  const { data: myAppointments, isLoading, error, isError } = useGetMyAppointments();
  const { mutate: cancelAppointment } = useCancelAppointment();
  const { mutate: confirmAppointment } = useConfirmAppointment();
  
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const pageSize = 8;

  const isDoctor = user?.role?.toLowerCase() === "doctor";
  const safeAppointmentsArray = Array.isArray(myAppointments) ? myAppointments : (myAppointments as any)?.items || [];

  const processedAppointments = useMemo(() => {
    let list = [...safeAppointmentsArray];
    if (dateFilter) list = list.filter((a: any) => a.startUtc?.startsWith(dateFilter));
    list.sort((a: any, b: any) => new Date(b.startUtc).getTime() - new Date(a.startUtc).getTime());
    return list;
  }, [safeAppointmentsArray, dateFilter]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedAppointments.slice(start, start + pageSize);
  }, [processedAppointments, currentPage]);

  const totalPages = Math.ceil(processedAppointments.length / pageSize);

  const handleConfirmCancellation = () => {
    if (!cancelTargetId) return;
    cancelAppointment(cancelTargetId, {
      onSuccess: () => {
        if (activeAppointment?.id === cancelTargetId) setActiveAppointment(null);
        setCancelTargetId(null);
        toast.success("Appointment cancelled successfully");
      },
      onError: (err: any) => {
        toast.error(`Could not cancel: ${err?.message}`);
        setCancelTargetId(null);
      }
    });
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    if (newStatus === "Confirmed") {
      confirmAppointment(appointmentId, {
        onSuccess: () => toast.success("Appointment Confirmed"),
        onError: () => toast.error("Failed to confirm appointment")
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl w-full mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isDoctor ? "Patient Appointments" : "Your Appointments"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track upcoming schedules.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border shadow-sm">
          <RiCalendarLine size={18} className="text-slate-400 ml-2" />
          <Input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }} 
            className="w-40 border-0 shadow-none focus-visible:ring-0 h-8 text-sm" 
          />
          {dateFilter && (
            <Button variant="ghost" size="sm" onClick={() => setDateFilter("")} className="h-8 text-xs text-slate-500 hover:text-slate-800">Clear</Button>
          )}
        </div>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <RiAlertLine size={18} className="text-red-600 flex-shrink-0" /> 
          <span className="font-medium">Failed to load appointments. Please try again later.</span>
        </div>
      )}

      {!isError && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-sm text-slate-500 font-medium animate-pulse">Loading scheduling data...</div>
          ) : paginatedList.length > 0 ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12 text-center font-semibold text-slate-700 h-11">S.N</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">{isDoctor ? "Patient Details" : "Doctor Details"}</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">Schedule Date & Time</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11">Current Status</TableHead>
                      <TableHead className="font-semibold text-slate-700 h-11 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedList.map((apt: any, index: number) => {
                      const globalIndex = (currentPage - 1) * pageSize + index + 1;
                      
                      return (
                        <TableRow key={apt.id} className="group hover:bg-slate-50/50 transition-colors">
                          {/* Index Column */}
                          <TableCell className="py-3 text-center text-sm font-medium text-slate-400">
                            {globalIndex}
                          </TableCell>

                          {/* Name Column (ID removed) */}
                          <TableCell className="py-3">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {isDoctor ? apt.patientName : `Dr. ${apt.doctorName}`}
                            </div>
                          </TableCell>
                          
                          {/* Date & Time Column */}
                          <TableCell className="py-3">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                              <RiCalendarLine size={14} className="text-slate-400" />
                              {new Date(apt.startUtc).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <RiTimeLine size={14} className="text-slate-400" />
                              {new Date(apt.startUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </TableCell>
                          
                          {/* Status Column */}
                          <TableCell className="py-3">
                            {isDoctor && apt.status === "Pending" ? (
                              <select
                                value={apt.status}
                                onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                                className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 ${getStatusBadge(apt.status)}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                              </select>
                            ) : (
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(apt.status)}`}>
                                {apt.status}
                              </span>
                            )}
                          </TableCell>
                          
                          {/* Actions Column */}
                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100"
                                onClick={() => setActiveAppointment(apt)}
                              >
                                View
                              </Button>
                              
                              {!isDoctor && ["Pending", "Scheduled", "Confirmed"].includes(apt.status) && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50" 
                                  onClick={() => setCancelTargetId(apt.id)}
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
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm text-slate-500">
                    Showing <span className="font-medium text-slate-900">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * pageSize, processedAppointments.length)}</span> of <span className="font-medium text-slate-900">{processedAppointments.length}</span> entries
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8" disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" className="h-8" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(c => c + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <RiCalendarLine size={24} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No appointments found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Try adjusting your date filters or check back later for new bookings.</p>
              {dateFilter && (
                <Button variant="outline" size="sm" onClick={() => setDateFilter("")} className="mt-4 text-xs h-8">Clear Filters</Button>
              )}
            </div>
          )}
        </div>
      )}

      <AppointmentDetailsModal appointment={activeAppointment} isOpen={!!activeAppointment} onClose={() => setActiveAppointment(null)} isDoctor={isDoctor} />
      <CancelConfirmationModal isOpen={!!cancelTargetId} onClose={() => setCancelTargetId(null)} onConfirm={handleConfirmCancellation} />
    </div>
  );
}