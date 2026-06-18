// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { appointmentsApi } from "@/features/appointments/api/appointments-api";
// import { RiCalendarEventLine, RiUserHeartLine } from "@remixicon/react";

// export function FollowUpDates() {
//   const { data: appointments, isLoading } = useQuery({
//     queryKey: ["appointments", "user"],
//     queryFn: appointmentsApi.getMyAppointments,
//   });

//   // Filter for appointments that have a defined follow-up context 
//   // (or simulate a standard 1-week follow-up target date from completed ones if your backend doesn't explicitly serve a followUpDate property yet)
//   const followUpAppointments = appointments?.filter(
//     (apt) => apt.status === "Completed" || apt.followUpDate
//   ) || [];

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
//       <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//         <h3 className="font-semibold text-base text-slate-900 tracking-tight flex items-center gap-2">
//           <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg select-none">
//             <RiCalendarEventLine className="w-4 h-4" />
//           </span>
//           Follow-Up Milestones
//         </h3>
//         <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
//           {followUpAppointments.length} Total
//         </span>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-6 text-xs text-muted-foreground animate-pulse">
//           Fetching care timelines...
//         </div>
//       ) : followUpAppointments.length > 0 ? (
//         <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
//           {followUpAppointments.map((apt) => {
//             // If backend has a genuine property use it, otherwise fall back to a standard checkup timeline presentation
//             const appointmentDate = new Date(apt.startUtc || apt.appointmentDate);
//             const followUpTarget = apt.followUpDate 
//               ? new Date(apt.followUpDate) 
//               : new Date(appointmentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later formula fallback

//             const formattedDate = followUpTarget.toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             });

//             const doctorName = apt.doctorName || apt.doctor?.name || "Your Specialist Medical Provider";

//             return (
//               <div 
//                 key={apt.id} 
//                 className="group p-3 border border-slate-100 bg-slate-50/40 hover:bg-indigo-50/20 hover:border-indigo-100 rounded-xl transition-all duration-150 flex items-center gap-3"
//               >
//                 <div className="p-2 bg-white group-hover:bg-indigo-50 border border-slate-100 group-hover:border-indigo-100 rounded-lg text-slate-500 group-hover:text-indigo-600 transition-colors">
//                   <RiUserHeartLine className="w-4 h-4" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-bold text-slate-800 truncate">
//                     {doctorName}
//                   </p>
//                   <p className="text-[11px] font-medium text-slate-500 mt-0.5">
//                     Target Date: <span className="text-indigo-600 font-semibold">{formattedDate}</span>
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center py-8 px-4 border border-dashed border-slate-100 rounded-xl bg-slate-50/30">
//           <p className="text-xs text-muted-foreground font-medium">
//             No scheduled or target follow-up tracks found for your profile.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }