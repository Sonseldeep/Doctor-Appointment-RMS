
"use client";

import { RiAlertLine } from "@remixicon/react";
import { toast } from "sonner";

interface CancelConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelConfirmationModal({ isOpen, onClose, onConfirm }: CancelConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    onConfirm();
    toast.success("Your appointment has been cancelled.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Box */}
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-slate-100 transform transition-all scale-100">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon Banner */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-4">
            <RiAlertLine size={24} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Cancel Appointment Scheduled?
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Are you sure you want to cancel this appointment session? This release process will free up the doctor's calendar grid.
          </p>
        </div>

        {/* Operational Flow Action Triggers */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            No, Keep Booking
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-100 transition-colors"
            onClick={handleConfirmClick}
          >
            Yes, Cancel It
          </button>
        </div>
      </div>
    </div>
  );
}