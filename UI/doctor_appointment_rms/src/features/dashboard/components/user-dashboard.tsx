// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { appointmentsApi } from "@/features/appointments/api/appointments-api";
// import { AppointmentCard } from "@/features/appointments/components/appointment-card";
// import { BookAppointmentForm } from "@/features/appointments/components/book-appointment-form";
// import { StatCard } from "./stat-card";
// import { HealthAlerts } from "./health-alerts";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import {
//   RiCalendarLine,
//   RiCheckLine,
//   RiCapsuleLine,
//   RiFileListLine,
//   RiCalendar2Line,
// } from "@remixicon/react";

// export function UserDashboard() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const { data: user } = useCurrentUser();
//   const { data: appointments, isLoading, refetch } = useQuery({
//     queryKey: ["appointments", "user"],
//     queryFn: appointmentsApi.getMyAppointments,
//   });

//   const upcoming = appointments?.filter(
//     apt => apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
//   ).length || 0;
//   const completed = appointments?.filter(apt => apt.status === "Completed").length || 0;
//   const cancelled = appointments?.filter(apt => apt.status === "Cancelled").length || 0;

//   return (
//     <div className="space-y-8">
//       {/* Welcome Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">
//           Welcome back, {user?.firstName}!
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           Here's an overview of your healthcare
//         </p>
//       </div>

//       {/* Stat Cards Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Upcoming Appointments"
//           value={upcoming}
//           icon={<RiCalendarLine />}
//           backgroundColor="bg-blue-50"
//         />
//         <StatCard
//           title="Completed Appointments"
//           value={completed}
//           icon={<RiCheckLine />}
//           trend={12}
//           backgroundColor="bg-green-50"
//         />
//         <StatCard
//           title="Active Prescriptions"
//           value={3}
//           icon={<RiCapsuleLine />}
//           backgroundColor="bg-purple-50"
//         />
//         <StatCard
//           title="Medical Reports"
//           value={8}
//           icon={<RiFileListLine />}
//           backgroundColor="bg-orange-50"
//         />
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Left Column - Appointments */}
//         <div className="lg:col-span-2 space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
//             <Button
//               onClick={() => setIsDialogOpen(true)}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Book New
//             </Button>
//           </div>

//           {isLoading ? (
//             <div className="rounded-xl border p-8 text-center">
//               <p className="text-muted-foreground">Loading appointments...</p>
//             </div>
//           ) : appointments?.filter(apt => 
//             apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
//           ).length ? (
//             <div className="space-y-3">
//               {appointments
//                 .filter(apt => 
//                   apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
//                 )
//                 .slice(0, 5) // Show top 5
//                 .map(apt => (
//                   <AppointmentCard 
//                     key={apt.id} 
//                     appointment={apt}
//                     onCancel={() => {
//                       // Handle cancel logic
//                       refetch();
//                     }}
//                   />
//                 ))}
//             </div>
//           ) : (
//             <div className="rounded-xl border border-dashed p-8 text-center">
//               <p className="text-muted-foreground">No upcoming appointments</p>
//               <Button
//                 onClick={() => setIsDialogOpen(true)}
//                 variant="outline"
//                 className="mt-4"
//               >
//                 Book your first appointment
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Alerts & Quick Actions */}
//         <div className="space-y-6">
//           <HealthAlerts />

//           <div className="space-y-3">
//             <h3 className="font-semibold text-lg">Quick Actions</h3>
//             <Button className="w-full bg-gray-900 hover:bg-gray-800" variant="default">
//               <RiCalendar2Line className="mr-2" /> Book Appointment
//             </Button>
//             <Button variant="outline" className="w-full">
//               <RiFileListLine className="mr-2" /> View Medical Records
//             </Button>
//             <Button variant="outline" className="w-full">
//               <RiCapsuleLine className="mr-2" /> View Prescriptions
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Booking Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Book New Appointment</DialogTitle>
//           </DialogHeader>
//           <BookAppointmentForm
//             onSuccess={() => {
//               setIsDialogOpen(false);
//               refetch();
//             }}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // Added for routing to the doctors page
import { appointmentsApi } from "@/features/appointments/api/appointments-api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { StatCard } from "./stat-card";
import { HealthAlerts } from "./health-alerts";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  RiCalendarLine,
  RiCheckLine,
  RiTimeLine,
  RiHistoryLine,
  RiCalendar2Line,
  RiFileListLine,
  RiCapsuleLine,
} from "@remixicon/react";

export function UserDashboard() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["appointments", "user"],
    queryFn: appointmentsApi.getMyAppointments,
  });

  // 📊 CLEANED DYNAMIC STATS (Derived straight from your actual live database context)
  const upcomingCount = appointments?.filter(
    apt => apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
  ).length || 0;

  const pendingCount = appointments?.filter(
    apt => apt.status === "Pending"
  ).length || 0;

  const completedCount = appointments?.filter(
    apt => apt.status === "Completed"
  ).length || 0;

  const totalLifetimeCount = appointments?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's a real-time overview of your medical schedules and status tracking.
        </p>
      </div>

      {/* 🏎️ Dynamic Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Bookings"
          value={upcomingCount}
          icon={<RiCalendarLine />}
          backgroundColor="bg-blue-50/70"
        />
        <StatCard
          title="Awaiting Approval"
          value={pendingCount}
          icon={<RiTimeLine className="text-amber-600" />}
          backgroundColor="bg-amber-50/70"
        />
        <StatCard
          title="Completed Consults"
          value={completedCount}
          icon={<RiCheckLine className="text-emerald-600" />}
          backgroundColor="bg-emerald-50/70"
        />
        <StatCard
          title="Total Consultations"
          value={totalLifetimeCount}
          icon={<RiHistoryLine className="text-indigo-600" />}
          backgroundColor="bg-indigo-50/70"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Appointments Workspace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Active Consultations</h2>
            {/* "Book New" button removed from here */}
          </div>

          {isLoading ? (
            <div className="rounded-xl border p-12 text-center text-sm text-muted-foreground animate-pulse bg-slate-50/30">
              Syncing appointment logs with clinic databases...
            </div>
          ) : appointments?.filter(apt => 
            apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
          ).length ? (
            <div className="space-y-3">
              {appointments
                .filter(apt => 
                  apt.status === "Confirmed" || apt.status === "Scheduled" || apt.status === "Pending"
                )
                .slice(0, 5) // Show top 5 items max to prevent vertical overload
                .map(apt => (
                  <AppointmentCard 
                    key={apt.id} 
                    appointment={apt}
                    onCancel={() => {
                      refetch();
                    }}
                  />
                ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center bg-slate-50/20">
              <p className="text-muted-foreground text-sm font-medium">No upcoming or pending appointments active.</p>
              <Button
                onClick={() => router.push("/doctors")} // Redirects directly to the doctors page
                variant="outline"
                className="mt-4 border-slate-200 hover:bg-slate-50 shadow-sm"
              >
                Book your first consultation block
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - System Messages & Side Actions */}
        <div className="space-y-6">
          <HealthAlerts />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg tracking-tight">Quick Dashboard Actions</h3>
            <Button 
              onClick={() => router.push("dashboard/doctors")} // Redirects directly to the doctors page
              className="w-full bg-slate-950 hover:bg-slate-900 shadow-sm transition-all" 
              variant="default"
            >
              <RiCalendar2Line className="mr-2 w-4 h-4" /> Book Appointment
            </Button>
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-not-allowed opacity-50">
              <RiFileListLine className="mr-2 w-4 h-4" /> View Records (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-not-allowed opacity-50">
              <RiCapsuleLine className="mr-2 w-4 h-4" /> View Prescriptions (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}