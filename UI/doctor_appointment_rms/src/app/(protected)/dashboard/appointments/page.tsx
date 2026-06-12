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

"use client";

import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useGetMyAppointments } from "@/features/appointments/hooks/use-my-appointment";
import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { AppointmentDetailsModal } from "@/features/appointments/components/appointment-details-modal";
import { CancelConfirmationModal } from "@/features/appointments/components/cancel-confirmation-modal"; // Import new modal
import { Appointment } from "@/features/appointments/types/appointments.types";
import { RiAlertLine } from "@remixicon/react";

export default function AppointmentsPage() {
  const { data: user } = useCurrentUser();
  const { data: myAppointments, isLoading, error, isError } = useGetMyAppointments();
  const { mutate: cancelAppointment } = useCancelAppointment();
  
  // State variables for popups
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null); // Track id to be canceled

  const isDoctor = user?.role?.toLowerCase() === "doctor";
  const safeAppointmentsArray = Array.isArray(myAppointments) ? myAppointments : (myAppointments as any)?.items || [];

  // Triggers when user clicks 'Yes, Cancel It' inside the beautiful modal frame
  const handleConfirmCancellation = () => {
    if (!cancelTargetId) return;

    cancelAppointment(cancelTargetId, {
      onSuccess: () => {
        if (activeAppointment?.id === cancelTargetId) {
          setActiveAppointment(null);
        }
        setCancelTargetId(null); // Safely closes down confirmation view
      },
      onError: (err: any) => {
        alert(`Could not cancel appointment: ${err?.response?.data?.message || err.message}`);
        setCancelTargetId(null);
      }
    });
  };

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
                  onCancel={(id) => setCancelTargetId(id)} // Open our new beautiful modal instead
                  isDoctorView={isDoctor} // 👈 Added this line here to automatically flip layouts
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

      {/* Presentation View Modal */}
      <AppointmentDetailsModal
        appointment={activeAppointment}
        isOpen={!!activeAppointment}
        onClose={() => setActiveAppointment(null)}
        isDoctor={isDoctor}
      />

      {/* Custom Core Cancellation Modal */}
      <CancelConfirmationModal
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancellation}
      />
    </div>
  );
}