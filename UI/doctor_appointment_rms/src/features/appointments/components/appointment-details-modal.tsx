
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConfirmAppointment } from "../hooks/use-my-appointment";
import { Appointment } from "../types/appointments.types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ClinicalNotesModal } from "./clinical-notes-modal";
import { RatingModal } from "@/features/ratings/components/rating-modal"; // 1. Added Rating Modal Import
import { CheckCircle2 } from "lucide-react";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  isDoctor: boolean;
}

export function AppointmentDetailsModal({ appointment, isOpen, onClose, isDoctor }: AppointmentDetailsModalProps) {
  const confirmMutation = useConfirmAppointment();
  const [localStatus, setLocalStatus] = useState<string>("");
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false); // 2. State to track the rating layout visibility

  useEffect(() => {
    if (appointment) setLocalStatus(appointment.status);
  }, [appointment]);

  if (!appointment) return null;

  const date = new Date(appointment.startUtc);
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleStatusUpdate = async (value: string) => {
    if (value === "Confirmed") {
      setLocalStatus("Confirmed");
      try {
        await confirmMutation.mutateAsync(appointment.id);
        toast.success("Appointment confirmed successfully.");
        onClose();
      } catch (error) {
        toast.error("Failed to confirm appointment.");
        setLocalStatus(appointment.status);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md bg-white rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Appointment Analysis</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Patient Name</p>
                <p className="font-bold text-gray-900 text-sm">
                  {appointment.patientName ? appointment.patientName : `Dr. ${appointment.doctorName}`}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Schedule Window</p>
                <p className="font-bold text-gray-900 text-sm">{formattedDate}</p>
                <p className="text-xs text-slate-500 mt-0.5">{formattedTime}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1.5">Patient Notes</h4>
              <div className="bg-slate-50/50 border rounded-lg p-3 text-sm text-gray-600 min-h-[60px]">
                {appointment.notes || "No extra system diagnostic intake ledger arguments filed."}
              </div>
            </div>

            {/* Doctor Controls */}
            {isDoctor && (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                {appointment.status === "Completed" ? (
                  <div className="w-full py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 size={18} className="text-green-600" />
                    Consultation Completed
                  </div>
                ) : appointment.status === "Confirmed" ? (
                  <button
                    type="button"
                    onClick={() => setIsNotesModalOpen(true)}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Add Clinical Notes & Prescription
                  </button>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Workflow Process</label>
                    <select
                      value={localStatus}
                      disabled={confirmMutation.isPending}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* 3. Patient Specific Controls (Renders Leave Review Button Only When Completed) */}
            {!isDoctor && appointment.status === "Completed" && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(true)}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
                >
                  Leave a Rating & Review
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Clinical Notes Modal */}
      <ClinicalNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          onClose(); 
        }}
        appointmentId={appointment.id}
      />

      {/* 4. Connected Rating Modal Component Wrapper */}
      <RatingModal 
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        appointment={appointment} 
      />
    </>
  );
}