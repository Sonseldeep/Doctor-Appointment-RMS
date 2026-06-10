// // "use client";

// // import { useState } from "react";
// // import { useDoctors } from "@/features/doctors/hooks/use-doctors";
// // import { DoctorsList } from "@/features/doctors/components/doctors-list";
// // import { BookAppointmentForm } from "@/features/appointments/components/book-appointment-form";
// // import { Doctor } from "@/features/doctors/types/doctor.types";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// // export default function AppointmentsPage() {
// //   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
// //   const { data: doctors, isLoading } = useDoctors();

// //   // FIX: Safely normalize backend data structures into a clean array 
// //   // to prevent client-side "TypeError: doctors.filter is not a function"
// //   const safeDoctorsArray = Array.isArray(doctors)
// //     ? doctors
// //     : (doctors as any)?.items || (doctors as any)?.data || [];

// //   return (
// //     <div className="space-y-8">
// //       <div>
// //         <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
// //         <p className="text-muted-foreground mt-2">
// //           Find and select a doctor to book your appointment
// //         </p>
// //       </div>

// //       <DoctorsList
// //         doctors={safeDoctorsArray}
// //         isLoading={isLoading}
// //         onSelectDoctor={setSelectedDoctor}
// //       />

// //       {/* Booking Dialog */}
// //       <Dialog
// //         open={!!selectedDoctor}
// //         onOpenChange={(open) => {
// //           if (!open) setSelectedDoctor(null);
// //         }}
// //       >
// //         <DialogContent className="max-w-md">
// //           <DialogHeader>
// //             <DialogTitle>
// //               Book Appointment with Dr. {selectedDoctor?.firstName}{" "}
// //               {selectedDoctor?.lastName}
// //             </DialogTitle>
// //           </DialogHeader>
// //           {selectedDoctor && (
// //             <BookAppointmentForm
// //               preFilledDoctorId={selectedDoctor.userId}
// //               onSuccess={() => {
// //                 setSelectedDoctor(null);
// //               }}
// //             />
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useDoctors } from "@/features/doctors/hooks/use-doctors";
// import { DoctorsList } from "@/features/doctors/components/doctors-list";
// import { BookAppointmentForm } from "@/features/appointments/components/book-appointment-form";
// import { Doctor } from "@/features/doctors/types/doctor.types";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { RiCalendarEventLine, RiTimeLine, RiUserLine, RiHeartPulseLine, RiMessage2Line, RiAlertLine } from "@remixicon/react";

// // IMPORT YOUR CUSTOM AXIOS CLIENT
// import axiosClient from "@/lib/axios";

// // ==========================================
// // 1. DATA TYPES & HOOK 
// // ==========================================
// export interface Appointment {
//   id: string;
//   patientUserId: string;
//   doctorUserId: string;
//   startUtc: string;
//   endUtc: string;
//   status: "Pending" | "Confirmed" | "Completed" | string;
//   notes: string;
//   doctorName: string;
//   doctorSpecialization: string;
//   patientName: string;
//   patientSex: string;
//   patientAge: number;
// }

// // Now routed through your project's authenticated axios client!
// async function fetchMyAppointments(): Promise<Appointment[]> {
//   const response = await axiosClient.get("/api/appointments/me");
  
//   // Axios automatically parses JSON into the `.data` property
//   return response.data;
// }

// function useGetMyAppointments() {
//   return useQuery<Appointment[], Error>({
//     queryKey: ["appointments", "me"],
//     queryFn: fetchMyAppointments,
//     retry: 1,
//   });
// }

// // ==========================================
// // 2. MAIN DASHBOARD UI
// // ==========================================
// export default function AppointmentsPage() {
//   const { data: user } = useCurrentUser();
//   const { data: myAppointments, isLoading: isAppointmentsLoading, error: appointmentsError, isError } = useGetMyAppointments();
//   const { data: doctors, isLoading: isDoctorsLoading } = useDoctors();
  
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [activeTab, setActiveTab] = useState<"list" | "book">("list");

//   const isDoctor = user?.role?.toLowerCase() === "doctor";

//   // Safely normalize raw API arrays vs paginated objects
//   const safeDoctorsArray = Array.isArray(doctors)
//     ? doctors
//     : (doctors as any)?.items || (doctors as any)?.data || [];

//   const safeAppointmentsArray = Array.isArray(myAppointments)
//     ? myAppointments
//     : (myAppointments as any)?.items || (myAppointments as any)?.data || [];

//   const formatTime = (isoString: string) => {
//     const d = new Date(isoString);
//     return {
//       date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//       time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//     };
//   };

//   return (
//     <div className="space-y-6 max-w-5xl w-full mx-auto">
      
//       {/* Dynamic Navigation Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 border-slate-100">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//             {isDoctor ? "Patient Appointments Schedule" : "Your Appointment Dashboard"}
//           </h1>
//           <p className="text-muted-foreground mt-1 text-sm">
//             {isDoctor 
//               ? "Review clinical booking dates and diagnostic logs submitted by patients." 
//               : "Manage existing sessions or connect with care practitioners."}
//           </p>
//         </div>

//         {!isDoctor && (
//           <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto self-stretch sm:self-auto">
//             <button
//               onClick={() => setActiveTab("list")}
//               className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
//                 activeTab === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               My Bookings
//             </button>
//             <button
//               onClick={() => setActiveTab("book")}
//               className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
//                 activeTab === "book" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Book New Appointment
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Network Authorization Alert */}
//       {isError && (
//         <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
//           <RiAlertLine size={16} className="text-red-600 flex-shrink-0" />
//           <span> Failed to sync data records: {appointmentsError?.message}</span>
//         </div>
//       )}

//       {/* VIEW A: Active Dashboard Log Feed */}
//       {(isDoctor || activeTab === "list") && !isError && (
//         <div className="space-y-4">
//           {isAppointmentsLoading ? (
//             <div className="text-center py-12 text-sm text-muted-foreground font-medium animate-pulse">
//               Synchronizing records list...
//             </div>
//           ) : safeAppointmentsArray.length > 0 ? (
//             <div className="grid grid-cols-1 gap-4">
//               {safeAppointmentsArray.map((appointment: Appointment) => {
//                 const { date, time } = formatTime(appointment.startUtc);
//                 return (
//                   <Card key={appointment.id} className="border-gray-100 shadow-sm overflow-hidden hover:border-blue-100 transition">
//                     <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
//                       <div className="flex items-start gap-4">
//                         <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           {isDoctor ? <RiUserLine size={20} /> : <RiHeartPulseLine size={20} />}
//                         </div>
//                         <div>
//                           {/* Dynamically displays Name instead of raw ID string */}
//                           <h3 className="font-bold text-gray-900 text-base">
//                             {isDoctor ? appointment.patientName : `Dr. ${appointment.doctorName}`}
//                           </h3>
//                           <p className="text-xs text-muted-foreground mt-0.5">
//                             {isDoctor 
//                               ? `Patient Profile: ${appointment.patientSex} • Age ${appointment.patientAge}` 
//                               : `Specialization: ${appointment.doctorSpecialization}`}
//                           </p>
//                           {appointment.notes && (
//                             <div className="mt-2 text-xs text-gray-600 bg-slate-50 border border-slate-100 rounded-md p-2 flex gap-1.5 items-start max-w-xl">
//                               <RiMessage2Line size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
//                               <span className="italic">"{appointment.notes}"</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex flex-row md:flex-col items-end gap-3 w-full md:w-auto justify-between border-t md:border-none pt-3 md:pt-0">
//                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold self-start md:self-end ${
//                           appointment.status === "Pending" 
//                             ? "bg-amber-50 text-amber-700 border border-amber-100" 
//                             : "bg-emerald-50 text-emerald-700 border border-emerald-100"
//                         }`}>
//                           {appointment.status}
//                         </span>
                        
//                         <div className="text-right text-xs text-gray-700 space-y-0.5 font-medium">
//                           <div className="flex items-center gap-1.5 justify-end text-slate-500">
//                             <RiCalendarEventLine size={13} /> {date}
//                           </div>
//                           <div className="flex items-center gap-1.5 justify-end text-gray-900 font-semibold">
//                             <RiTimeLine size={13} /> {time}
//                           </div>
//                         </div>
//                       </div>

//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50/50 text-muted-foreground">
//               <p className="font-semibold text-gray-700 text-sm">No scheduled bookings recorded</p>
//               <p className="text-xs mt-1">Your active dashboard ledger registry is currently empty.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* VIEW B: Form Booking Router */}
//       {!isDoctor && activeTab === "book" && (
//         <div className="space-y-4">
//           <DoctorsList
//             doctors={safeDoctorsArray}
//             isLoading={isDoctorsLoading}
//             onSelectDoctor={setSelectedDoctor}
//           />
//         </div>
//       )}

//       {/* Booking Form Layout Context Modal */}
//       <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               Book Appointment with Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
//             </DialogTitle>
//           </DialogHeader>
//           {selectedDoctor && (
//             <BookAppointmentForm
//               preFilledDoctorId={selectedDoctor.userId}
//               onSuccess={() => {
//                 setSelectedDoctor(null);
//                 setActiveTab("list");
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
import { Appointment } from "@/features/appointments/types/appointments.types";
import { RiAlertLine } from "@remixicon/react";

export default function AppointmentsPage() {
  const { data: user } = useCurrentUser();
  const { data: myAppointments, isLoading, error, isError } = useGetMyAppointments();
  
  // State controller monitoring current detailed element context focus
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

  const isDoctor = user?.role?.toLowerCase() === "doctor";
  const safeAppointmentsArray = Array.isArray(myAppointments) ? myAppointments : (myAppointments as any)?.items || [];

  return (
    <div className="space-y-6 max-w-5xl w-full mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isDoctor ? "Patient Appointments Schedule" : "Your Appointment Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isDoctor ? "Review clinical booking dates and diagnostic logs submitted by patients." : "Manage existing care sessions."}
        </p>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
          <RiAlertLine size={16} className="text-red-600 flex-shrink-0" />
          <span>Failed to sync data records list: {error?.message}</span>
        </div>
      )}

      {!isError && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-sm text-muted-foreground font-medium animate-pulse">
              Synchronizing production system ledger registers...
            </div>
          ) : safeAppointmentsArray.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {safeAppointmentsArray.map((appointment: Appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() => setActiveAppointment(appointment)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-xl bg-slate-50/50 text-muted-foreground">
              <p className="font-semibold text-gray-700 text-sm">No scheduled bookings recorded</p>
              <p className="text-xs text-gray-400 mt-1">Your active dashboard ledger registry is currently empty.</p>
            </div>
          )}
        </div>
      )}

      {/* Domain-Level Isolated Presentation View Modal */}
      <AppointmentDetailsModal
        appointment={activeAppointment}
        isOpen={!!activeAppointment}
        onClose={() => setActiveAppointment(null)}
        isDoctor={isDoctor}
      />
    </div>
  );
}