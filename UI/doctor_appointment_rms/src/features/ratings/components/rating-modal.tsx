"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useSubmitDoctorRating } from "../hooks/use-ratings";
import { toast } from "sonner";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any; 
}

export function RatingModal({ isOpen, onClose, appointment }: RatingModalProps) {
  const [score, setScore] = useState(5);
  const [reviewText, setReviewText] = useState("");
  
  const { mutate, isPending } = useSubmitDoctorRating();

  // Helper function to validate real data strings
  const getValidId = (val: any): string | null => {
    if (!val) return null;
    const s = String(val).trim();
    if (s === "" || s === "undefined" || s === "null" || s === "[object Object]") return null;
    return s;
  };

  // Extract the true Doctor User ID from relational fields
  const rawId = 
    appointment?.doctor?.userId || 
    appointment?.doctor?.id || 
    appointment?.doctor?.user?.id ||
    appointment?.doctorUserId;

  const resolvedDoctorUserId = getValidId(rawId);

  const handleSubmit = () => {
    if (!resolvedDoctorUserId) {
      toast.error("Extraction error: Doctor User ID could not be resolved.");
      return;
    }

    if (!appointment?.id) {
      toast.error("Appointment identifier missing.");
      return;
    }

    // --- BACKEND FIELD ALIGNMENT ---
    // We send both casing conventions to ensure complete compatibility with your backend DTO
    const payloadData = {
      appointmentId: appointment.id,
      AppointmentId: appointment.id,
      
      score: score,
      stars: score,
      Stars: score, // Fixes the "Stars must be between 1 and 5" error explicitly
      
      reviewText: reviewText,
      ReviewText: reviewText,
      comment: reviewText,
      Comment: reviewText
    };

    console.log("Submitting final aligned payload:", {
      doctorUserId: resolvedDoctorUserId,
      data: payloadData
    });

    mutate({
      doctorUserId: resolvedDoctorUserId,
      data: payloadData as any // Bypass strict TS local contracts if the type isn't updated yet
    }, {
      onSuccess: () => {
        toast.success("Review submitted successfully!");
        onClose();
        setReviewText("");
        setScore(5);
      },
      onError: (error: any) => {
        console.error("Submission error response:", error.response?.data);
        toast.error(error.response?.data?.detail || "Failed to submit review.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
        </DialogHeader>

        {resolvedDoctorUserId ? (
          <div className="space-y-5 py-2">
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`h-8 w-8 cursor-pointer transition-all duration-150 ${
                    s <= score ? "fill-yellow-400 text-yellow-400 scale-110" : "text-slate-200 hover:text-slate-300"
                  }`} 
                  onClick={() => setScore(s)} 
                />
              ))}
            </div>
            <textarea 
              className="w-full h-32 p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your honest feedback about this consultation..."
              disabled={isPending}
            />
            <Button 
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm" 
              onClick={handleSubmit} 
              disabled={isPending}
            >
              {isPending ? "Submitting Evaluation..." : "Submit Review"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2 border-t border-slate-100 mt-2 text-left">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
               <strong>Relational Resolution Error:</strong> Could not extract any valid nested doctor properties.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}