// "use client";

// import { useState, useMemo } from "react";
// import { useSearchParams } from "next/navigation"; 
// import { useQueryClient } from "@tanstack/react-query";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
// import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
// import { useConfirmAppointment } from "@/features/appointments/hooks/use-my-appointment";
// import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
// import { CancelConfirmationModal } from "@/features/appointments/components/cancel-confirmation-modal";
// import { Appointment } from "@/features/appointments/types/appointments.types";
// import {
//   RiAlertLine,
//   RiCalendarLine,
//   RiTimeLine,
//   RiSearchLine,
//   RiFilter3Line,
//   RiUserLine,
// } from "@remixicon/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const getStatusBadge = (status: string) => {
//   switch (status?.toLowerCase()) {
//     case "completed":
//       return "bg-emerald-100 text-emerald-800 border-emerald-200";
//     case "confirmed":
//       return "bg-blue-100 text-blue-800 border-blue-200";
//     case "pending":
//       return "bg-amber-100 text-amber-800 border-amber-200";
//     case "scheduled":
//       return "bg-indigo-100 text-indigo-800 border-indigo-200";
//     case "cancelled":
//       return "bg-rose-100 text-rose-800 border-rose-200";
//     default:
//       return "bg-slate-100 text-slate-700 border-slate-200";
//   }
// };

// export default function AppointmentsPage() {
//   const queryClient = useQueryClient();
//   const { data: user } = useCurrentUser();
  
  
//   const searchParams = useSearchParams();
//   const targetAppointmentId = searchParams.get("id");
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
  
//   const { data: myAppointments, isLoading, isError } = useGetMyAppointments(currentPage, pageSize);
//   const { mutate: cancelAppointment } = useCancelAppointment();
//   const { mutate: confirmAppointment } = useConfirmAppointment();
  
//   const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
//   const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  
//   const [dateFilter, setDateFilter] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const isDoctor = user?.role?.toLowerCase() === "doctor";


//   const appointmentsArray = (myAppointments as any)?.items || [];
//   const totalCount = (myAppointments as any)?.totalCount || 0;

//   const totalPages = Math.ceil(totalCount / pageSize);

//   const processedAppointments = useMemo(() => {
//     let list = [...appointmentsArray];

//     if (dateFilter) {
//       list = list.filter((a: any) =>
//         a.startUtc?.startsWith(dateFilter)
//       );
//     }

//     if (searchQuery) {
//       const lowerQuery = searchQuery.toLowerCase();

//       list = list.filter((a: any) => {
//         return [
//           a.patientName,
//           a.doctorName,
//           a.status,
//         ].some((field) =>
//           field?.toLowerCase().includes(lowerQuery)
//         );
//       });
//     }

//     if (statusFilter) {
//       list = list.filter(
//         (a: any) =>
//           a.status?.toLowerCase() ===
//           statusFilter.toLowerCase()
//       );
//     }

//     list.sort(
//       (a: any, b: any) =>
//         new Date(b.startUtc).getTime() -
//         new Date(a.startUtc).getTime()
//     );

//     return list;
//   }, [
//     appointmentsArray,
//     dateFilter,
//     searchQuery,
//     statusFilter,
//   ]);

//   const handleConfirmCancellation = () => {
//     if (!cancelTargetId) return;
//     cancelAppointment(cancelTargetId, {
//       onSuccess: () => {
//         if (activeAppointment?.id === cancelTargetId) setActiveAppointment(null);
//         setCancelTargetId(null);
//         toast.success("Appointment cancelled successfully");
//         queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
//       },
//       onError: (err: any) => {
//         toast.error(`Could not cancel: ${err?.message}`);
//         setCancelTargetId(null);
//       }
//     });
//   };

//   const handleStatusChange = (appointmentId: string, newStatus: string) => {
//     if (newStatus === "Confirmed") {
//       confirmAppointment(appointmentId, {
//         onSuccess: () => {
//           toast.success("Appointment Confirmed");
//           queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
//         },
//         onError: () => toast.error("Failed to confirm appointment")
//       });
//     }
//   };

//   // Handle Page Size Change safely
//   const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newSize = parseInt(e.target.value, 10);
//     setPageSize(newSize);
//     setCurrentPage(1); // Reset to page 1 whenever sizing changes
//   };

//   return (
//     <div className="space-y-6 max-w-6xl w-full mx-auto p-4 md:p-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//           {isDoctor ? "Patient Appointments" : "My Appointments"}
//         </h1>
//         <p className="text-sm text-slate-500 mt-1">Manage and track upcoming schedules.</p>
//       </div>
        
//       <div className="w-full lg:w-auto">
//         <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

//           <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
//             <RiFilter3Line size={18} className="text-slate-500" />

//             <span className="text-sm font-semibold text-slate-800">
//               Filters & Search
//             </span>
//           </div>

//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

//               <div className="relative">
//                 <RiSearchLine
//                   size={18}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <Input
//                   placeholder={`Search ${
//                     isDoctor ? "patients" : "doctors"
//                   }`}
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="h-11 pl-10 rounded-xl bg-slate-50"
//                 />
//               </div>

//               <div className="relative">
//                 <RiCalendarLine
//                   size={18}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <Input
//                   type="date"
//                   value={dateFilter}
//                   onChange={(e) => {
//                     setDateFilter(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="h-11 pl-10 rounded-xl bg-slate-50"
//                 />
//               </div>

//               <select
//                 value={statusFilter}
//                 onChange={(e) => {
//                   setStatusFilter(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="
//                   h-11
//                   rounded-xl
//                   border
//                   border-slate-200
//                   bg-slate-50
//                   px-3
//                   text-sm
//                   font-medium
//                   outline-none
//                   focus:ring-2
//                   focus:ring-blue-500/20
//                 "
//               >
//                 <option value="">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Confirmed">Confirmed</option>
//                 <option value="Scheduled">Scheduled</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>

//             <div className="flex flex-wrap gap-2 mt-4">
//               <Button
//                 size="sm"
//                 variant={!statusFilter ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={() => setStatusFilter("")}
//               >
//                 All
//               </Button>

//               <Button
//                 size="sm"
//                 variant={statusFilter === "Pending" ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={() => setStatusFilter("Pending")}
//               >
//                 Pending
//               </Button>

//               <Button
//                 size="sm"
//                 variant={statusFilter === "Confirmed" ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={() => setStatusFilter("Confirmed")}
//               >
//                 Confirmed
//               </Button>

//               <Button
//                 size="sm"
//                 variant={statusFilter === "Completed" ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={() => setStatusFilter("Completed")}
//               >
//                 Completed
//               </Button>

//               <Button
//                 size="sm"
//                 variant={statusFilter === "Cancelled" ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={() => setStatusFilter("Cancelled")}
//               >
//                 Cancelled
//               </Button>

//               {(searchQuery || dateFilter || statusFilter) && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="ml-auto"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setDateFilter("");
//                     setStatusFilter("");
//                     setCurrentPage(1);
//                   }}
//                 >
//                   Clear All
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isError && (
//         <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
//           <RiAlertLine size={18} className="text-red-600 flex-shrink-0" /> 
//           <span className="font-medium">Failed to load appointments. Please try again later.</span>
//         </div>
//       )}

//       {!isError && (
//         <div className="space-y-4">
//           {isLoading ? (
//             <div className="text-center py-20 text-sm text-slate-500 font-medium animate-pulse">Loading scheduling data...</div>
//           ) : processedAppointments.length > 0 ? (
//             <>
//               {/* Table wrapper */}
//               <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//                 <Table>
//                   <TableHeader className="bg-slate-50 border-b border-slate-200">
//                     <TableRow className="hover:bg-transparent">
//                       <TableHead className="w-12 text-center font-semibold text-slate-700 h-11">S.N</TableHead>
//                       <TableHead className="font-semibold text-slate-700 h-11">{isDoctor ? "Patient Details" : "Doctor Details"}</TableHead>
//                       <TableHead className="font-semibold text-slate-700 h-11">Schedule Date & Time</TableHead>
//                       <TableHead className="font-semibold text-slate-700 h-11">Current Status</TableHead>
//                       <TableHead className="font-semibold text-slate-700 h-11 text-right pr-10">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {processedAppointments.map((apt: any, index: number) => {
//                       const globalIndex = (currentPage - 1) * pageSize + index + 1;
                      
//                       // Identify profile context cleanly
//                       const avatarUrl = isDoctor ? apt.patientPhotoUrl : apt.doctorPhotoUrl;
//                       const displayName = isDoctor ? apt.patientName : `Dr. ${apt.doctorName}`;
                      
//                       // Compare row ID with URL target parameter to detect matching record
//                       const isHighlighted = apt.id === targetAppointmentId;
                      
//                       return (
//                         <TableRow 
//                           key={apt.id} 
//                           className={`group transition-all duration-300 ${
//                             isHighlighted 
//                               ? "bg-blue-50/60 hover:bg-blue-50/80 ring-1 ring-inset ring-blue-100" // Premium highlight styles
//                               : "hover:bg-slate-50/50 transition-colors"
//                           }`}
//                         >
//                           {/*Added left color accent indicator on highlighted serial column */}
//                           <TableCell className={`py-3 text-center text-sm font-medium transition-all ${
//                             isHighlighted 
//                               ? "text-blue-600 font-bold border-l-4 border-l-blue-500" 
//                               : "text-slate-400"
//                           }`}>
//                             {globalIndex}
//                           </TableCell>
                          
//                           <TableCell className="py-3">
//                             <div className="flex items-center gap-3">
//                               <div className="relative h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/80 shadow-sm flex items-center justify-center">
//                                 {avatarUrl ? (
//                                   <img
//                                     src={avatarUrl}
//                                     alt={displayName}
//                                     className="h-full w-full object-cover"
//                                     onError={(e) => {
//                                       // Secondary dynamic text fallback if link snaps/breaks
//                                       (e.target as HTMLImageElement).style.display = 'none';
//                                     }}
//                                   />
//                                 ) : (
//                                   <RiUserLine size={18} className="text-slate-400" />
//                                 )}
//                               </div>
                              
//                               <div className="flex flex-col">
//                                 <span className={`font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm ${
//                                   isHighlighted ? "text-blue-700" : ""
//                                 }`}>
//                                   {displayName}
//                                 </span>
//                                 <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
//                                   {isDoctor ? (
//                                     <>
//                                       <span className="font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
//                                         {apt.patientSex || "N/A"}
//                                       </span>
//                                       <span>•</span>
//                                       <span>{apt.patientAge ? `${apt.patientAge} Yrs` : "Age N/A"}</span>
//                                     </>
//                                   ) : (
//                                     <span className="text-blue-600 font-medium text-[11px]">
//                                       {apt.doctorSpecialization || "General Medicine"}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </TableCell>
                          
//                           <TableCell className="py-3">
//                             <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
//                               <RiCalendarLine size={14} className="text-slate-400" />
//                               {new Date(apt.startUtc).toLocaleDateString("en-US", { 
//                                 weekday: 'short', 
//                                 month: 'short', 
//                                 day: 'numeric',
//                                 timeZone: 'UTC' 
//                               })}
//                             </div>
//                             <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
//                               <RiTimeLine size={14} className="text-slate-400" />
//                               {new Date(apt.startUtc).toLocaleTimeString([], { 
//                                 hour: '2-digit', 
//                                 minute: '2-digit',
//                                 timeZone: 'UTC' 
//                               })}
//                             </div>
//                           </TableCell>
//                           <TableCell className="py-3">
//           <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(apt.status)}`}>
//             {apt.status}
//           </span>
//         </TableCell>
//                           <TableCell className="py-3 text-right">
//                             <div className="flex items-center justify-end gap-2">
//                               {/*  Swapped the base view button background if highlighted to make actions pop */}
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className={`h-8 text-xs font-medium text-slate-600 hover:text-slate-900 ${
//                                   isHighlighted ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-slate-50 hover:bg-slate-100"
//                                 }`}
//                                 onClick={() => setActiveAppointment(apt)}
//                               >
//                                 View
//                               </Button>

//                               {isDoctor && apt.status === "Pending" && (
//               <Button 
//                 size="sm" 
//                 className="h-8 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700" 
//                 onClick={() => handleStatusChange(apt.id, "Confirmed")}
//               >
//                 Confirm
//               </Button>
//             )}
                              
//                               {!isDoctor && ["Pending", "Scheduled", "Confirmed"].includes(apt.status) && (
//                                 <Button 
//                                   variant="ghost" 
//                                   size="sm" 
//                                   className="h-8 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50" 
//                                   onClick={() => setCancelTargetId(apt.id)}
//                                 >
//                                   Cancel
//                                 </Button>
//                               )}
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>

//                 {/* Footer Pagination Inside Table Wrapper */}
//                 {totalPages > 0 && (
//                   <div className="flex items-center justify-between border-t border-slate-200 p-4 bg-slate-50/50">
                    
//                     {/* Left: Items per page selector */}
//                     <div className="flex items-center gap-2 text-sm text-slate-600">
//                       <select 
//                         id="pageSize"
//                         value={pageSize}
//                         onChange={handlePageSizeChange}
//                         className="border border-slate-200 rounded-md px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
//                       >
//                         <option value={5}>5 per page</option>
//                         <option value={10}>10 per page</option>
//                         <option value={20}>20 per page</option>
//                         <option value={50}>50 per page</option>
//                       </select>
//                     </div>

//                     {/* Right: Prev/Next buttons ONLY */}
//                     <div className="flex gap-2 items-center">
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="h-8 text-xs bg-white" 
//                         disabled={currentPage === 1} 
//                         onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
//                       >
//                         Previous
//                       </Button>

//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="h-8 text-xs bg-white" 
//                         disabled={currentPage >= totalPages} 
//                         onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
//               <div className="bg-white p-3 rounded-full shadow-sm mb-3">
//                 <RiCalendarLine size={24} className="text-slate-400" />
//               </div>
//               <h3 className="text-sm font-semibold text-slate-900">No appointments found</h3>
//               <p className="text-xs text-slate-500 mt-1 max-w-sm">Try adjusting your filters or check back later for new bookings.</p>
              
//             </div>
//           )}
//         </div>
//       )}

//       <AppointmentDetailsModal appointment={activeAppointment} isOpen={!!activeAppointment} onClose={() => setActiveAppointment(null)} isDoctor={isDoctor} />
//       <CancelConfirmationModal isOpen={!!cancelTargetId} onClose={() => setCancelTargetId(null)} onConfirm={handleConfirmCancellation} />
//     </div>
//   );
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { useConfirmAppointment } from "@/features/appointments/hooks/use-my-appointment";
import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
import { CancelConfirmationModal } from "@/features/appointments/components/cancel-confirmation-modal";
import { Appointment, PagedResult } from "@/features/appointments/types/appointments.types";
import { RiAlertLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { AppointmentTabs, AppointmentTabKey } from "@/features/appointments/components/appointment-tabs";
import { AppointmentsFilters } from "@/features/appointments/components/appointments-filters";
import { AppointmentsTable } from "@/features/appointments/components/appointments-table";
import { AppointmentsEmptyState } from "@/features/appointments/components/appointments-empty-state";


const FETCH_BATCH_SIZE = 50;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function getUtcDateKey(date: Date | string) {
  const d = new Date(date);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function isFinishedStatus(status?: string) {
  const s = status?.toLowerCase();
  return s === "completed" || s === "cancelled";
}

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const searchParams = useSearchParams();
  const targetAppointmentId = searchParams.get("id");

  const { data: myAppointments, isLoading, isError } = useGetMyAppointments(1, FETCH_BATCH_SIZE);
  const { mutate: cancelAppointment } = useCancelAppointment();
  const { mutate: confirmAppointment } = useConfirmAppointment();

  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AppointmentTabKey>("today");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const isDoctor = user?.role?.toLowerCase() === "doctor";

  const appointmentsArray: Appointment[] = (myAppointments as PagedResult<Appointment> | undefined)?.items ?? [];

  const buckets = useMemo(() => {
    const todayKey = getUtcDateKey(new Date());
    const today: Appointment[] = [];
    const upcoming: Appointment[] = [];
    const finished: Appointment[] = [];

    for (const apt of appointmentsArray) {
      if (isFinishedStatus(apt.status)) {
        finished.push(apt);
        continue;
      }
      const aptKey = getUtcDateKey(apt.startUtc);
      // "today" also absorbs still-open past appointments (overdue) so nothing gets lost.
      if (aptKey <= todayKey) today.push(apt);
      else upcoming.push(apt);
    }

    const byDateAsc = (a: Appointment, b: Appointment) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime();
    const byDateDesc = (a: Appointment, b: Appointment) => new Date(b.startUtc).getTime() - new Date(a.startUtc).getTime();

    today.sort(byDateAsc);
    upcoming.sort(byDateAsc);
    finished.sort(byDateDesc);

    return { today, upcoming, finished };
  }, [appointmentsArray]);

  const activeList = buckets[activeTab];

  const processedAppointments = useMemo(() => {
    let list = [...activeList];

    if (dateFilter) {
      list = list.filter((a) => a.startUtc?.startsWith(dateFilter));
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter((a) =>
        [a.patientName, a.doctorName, a.status].some((field) => field?.toLowerCase().includes(lowerQuery))
      );
    }

    if (activeTab === "finished" && statusFilter) {
      list = list.filter((a) => a.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }, [activeList, dateFilter, searchQuery, statusFilter, activeTab]);

  const totalCount = processedAppointments.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pagedAppointments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedAppointments.slice(start, start + pageSize);
  }, [processedAppointments, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, dateFilter, searchQuery, statusFilter]);

  // Jump to whichever tab actually contains the appointment linked from a notification.
  useEffect(() => {
    if (!targetAppointmentId) return;
    if (buckets.today.some((a) => a.id === targetAppointmentId)) setActiveTab("today");
    else if (buckets.upcoming.some((a) => a.id === targetAppointmentId)) setActiveTab("upcoming");
    else if (buckets.finished.some((a) => a.id === targetAppointmentId)) setActiveTab("finished");
  }, [targetAppointmentId, buckets]);

  const handleConfirmCancellation = () => {
    if (!cancelTargetId) return;
    cancelAppointment(cancelTargetId, {
      onSuccess: () => {
        if (activeAppointment?.id === cancelTargetId) setActiveAppointment(null);
        setCancelTargetId(null);
        toast.success("Appointment cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
      },
      onError: (err: any) => {
        toast.error(`Could not cancel: ${err?.message}`);
        setCancelTargetId(null);
      },
    });
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    if (newStatus === "Confirmed") {
      confirmAppointment(appointmentId, {
        onSuccess: () => {
          toast.success("Appointment Confirmed");
          queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
        },
        onError: () => toast.error("Failed to confirm appointment"),
      });
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setDateFilter("");
    setStatusFilter("");
  };

  return (
    <div className="space-y-6 max-w-6xl w-full mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isDoctor ? "Patient Appointments" : "My Appointments"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track upcoming schedules.</p>
        </div>
        <AppointmentTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={{
            today: buckets.today.length,
            upcoming: buckets.upcoming.length,
            finished: buckets.finished.length,
          }}
        />
      </div>

      <AppointmentsFilters
        isDoctor={isDoctor}
        activeTab={activeTab}
        searchQuery={searchQuery}
        dateFilter={dateFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onDateChange={setDateFilter}
        onStatusChange={setStatusFilter}
        onClearAll={handleClearAllFilters}
      />

      {isError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <RiAlertLine size={18} className="text-red-600 flex-shrink-0" />
          <span className="font-medium">Failed to load appointments. Please try again later.</span>
        </div>
      )}

      {!isError && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-sm text-slate-500 font-medium animate-pulse">
              Loading scheduling data...
            </div>
          ) : pagedAppointments.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <AppointmentsTable
                appointments={pagedAppointments}
                isDoctor={isDoctor}
                startIndex={(currentPage - 1) * pageSize}
                targetAppointmentId={targetAppointmentId}
                onView={setActiveAppointment}
                onCancel={setCancelTargetId}
                onConfirm={(id) => handleStatusChange(id, "Confirmed")}
              />

              <div className="flex items-center justify-between border-t border-slate-200 p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border border-slate-200 rounded-md px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size} per page
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <AppointmentsEmptyState
              tab={activeTab}
              hasActiveFilters={Boolean(searchQuery || dateFilter || statusFilter)}
              onClearFilters={handleClearAllFilters}
            />
          )}
        </div>
      )}

      <AppointmentDetailsModal
        appointment={activeAppointment}
        isOpen={!!activeAppointment}
        onClose={() => setActiveAppointment(null)}
        isDoctor={isDoctor}
      />
      <CancelConfirmationModal
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancellation}
      />
    </div>
  );
}