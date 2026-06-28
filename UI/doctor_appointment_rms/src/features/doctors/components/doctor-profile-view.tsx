"use client";

import { useState } from "react";
import { Doctor } from "../types/doctor.types";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";
import { 
  useDoctorRatings, 
  useUpdateRating, 
  useDeleteRating 
} from "@/features/ratings/hooks/use-doctor-ratings";
import { 
  RiUserHeartLine, 
  RiStarFill, 
  RiTimeLine, 
  RiArrowLeftLine,
  RiCalendarCheckLine,
  RiChat4Line,
  RiPencilLine,
  RiDeleteBin6Line,
  RiCloseLine,
  RiCheckLine,
  RiAlertLine
} from "@remixicon/react";

interface DoctorProfileViewProps {
  doctor: Doctor;
  onBack: () => void;
  onProceedToBooking: () => void;
}

export function DoctorProfileView({ doctor, onBack, onProceedToBooking }: DoctorProfileViewProps) {
  const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
  
  const { data: currentUser } = useCurrentUser();
  const currentUserId = (currentUser as any)?.userId || (currentUser as any)?.id || "";

  const { data: ratingData, isLoading: isLoadingRatings } = useDoctorRatings(doctor.userId);
  const updateRatingMutation = useUpdateRating(doctor.userId);
  const deleteRatingMutation = useDeleteRating(doctor.userId);

  // Form controls state tracking
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);

  // Modern uniform delete confirmation tracking state
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);

  const displayRating = ratingData?.summary?.averageRating ? Number(ratingData.summary.averageRating).toFixed(1) : "0.0";
  const displayReviewsCount = ratingData?.summary?.totalRatings ?? 0;
  const reviewsList = ratingData?.ratings || [];

  const startEditing = (id: string, currentComment: string, currentStars: number) => {
    setEditingId(id);
    setEditComment(currentComment);
    setEditStars(currentStars);
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editComment.trim()) return;
    try {
      await updateRatingMutation.mutateAsync({
        ratingId: reviewId,
        stars: editStars,
        comment: editComment
      });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to push update sequence payload:", error);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!reviewIdToDelete) return;
    try {
      await deleteRatingMutation.mutateAsync(reviewIdToDelete);
      setReviewIdToDelete(null); // Clean up state targets
    } catch (error) {
      console.error("Failed to complete removal request cycle:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in relative">
      {/* Back Navigation Bar */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <RiArrowLeftLine size={18} />
        <span>Back to Doctors List</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
            {doctor.profilePhotoUrl ? (
              <img src={doctor.profilePhotoUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                <RiUserHeartLine className="text-blue-600" size={36} />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName}</h1>
            <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
              {doctor.specialization}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1">
                <RiStarFill className="text-amber-400" size={16} />
                <span className="text-slate-800 font-bold">{displayRating}</span> ({displayReviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <RiTimeLine className="text-slate-400" size={16} />
                <span>{doctor.experience ?? 10} Years Experience</span>
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col justify-between items-stretch md:items-end p-4 bg-slate-50 border border-slate-100 rounded-xl gap-4 min-w-[220px]">
          <div>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block mb-0.5">Consultation Fee</span>
            <span className="text-2xl font-extrabold text-slate-900">NPR {Number(doctor.consultationFee).toFixed(2)}</span>
          </div>
          <Button 
            onClick={onProceedToBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow transition-all w-full"
          >
            <RiCalendarCheckLine size={18} />
            <span>Book Appointment</span>
          </Button>
        </div>
      </div>

      {/* Profile Details Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>About Practitioner</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {doctor.bio && doctor.bio !== "string" 
              ? doctor.bio 
              : "This practitioner is fully accredited and dedicated to providing high-quality care."}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h2 className="text-base font-bold text-slate-900">Practice Details</h2>
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Availability</span>
              <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Mon - Fri</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Session Mode</span>
              <span className="font-medium text-slate-700">Video / Audio Call</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Reviews Segment */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RiChat4Line className="text-slate-400" />
            <span>Patient Reviews ({displayReviewsCount})</span>
          </h2>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
            <RiStarFill className="text-amber-400" size={18} />
            <span>{displayRating} out of 5</span>
          </div>
        </div>

        {isLoadingRatings ? (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-16 bg-slate-50 rounded-xl"></div>
          </div>
        ) : reviewsList.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No reviews submitted for this practitioner yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 space-y-4">
            {reviewsList.map((review) => {
              const isOwner = review.patientUserId === currentUserId;
              const isEditing = editingId === review.id;

              return (
                <div key={review.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {isOwner ? (
                        <span className="font-bold text-blue-700 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-md">
                          You ({currentUser?.firstName || "Patient"})
                        </span>
                      ) : (
                        <PatientNameLookup userId={review.patientUserId} />
                      )}
                      
                      {!isEditing && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.stars }).map((_, i) => (
                            <RiStarFill key={i} className="text-amber-400 w-3.5 h-3.5" />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">
                        {new Date(review.createdAtUtc).toLocaleDateString(undefined, {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </span>

                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
                          <button 
                            onClick={() => startEditing(review.id, review.comment, review.stars)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                            title="Edit Review"
                          >
                            <RiPencilLine size={15} />
                          </button>
                          <button 
                            onClick={() => setReviewIdToDelete(review.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition"
                            title="Delete Review"
                          >
                            <RiDeleteBin6Line size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 mt-2 animate-fade-in">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-semibold">Your Rating:</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditStars(star)}
                              className="transition transform active:scale-90"
                            >
                              <RiStarFill 
                                className={`w-5 h-5 ${star <= editStars ? "text-amber-400" : "text-slate-200"}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea 
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full min-h-[75px] rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner resize-none text-slate-700 font-medium"
                        rows={2}
                      />

                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingId(null)}
                          className="h-8 text-xs gap-1 rounded-lg font-semibold"
                        >
                          <RiCloseLine size={14} /> Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveEdit(review.id)}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 rounded-lg font-semibold shadow-sm"
                          disabled={updateRatingMutation.isPending}
                        >
                          <RiCheckLine size={14} /> {updateRatingMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed pl-1 italic">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 💎 UNIFORM HIGH-FIDELITY DELETION DIALOG OVERLAY */}
      {reviewIdToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl animate-scale-up space-y-4">
            
            {/* Header Description Frame */}
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-red-50 border border-red-100 rounded-xl text-red-600 flex-shrink-0">
                <RiAlertLine size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Delete Review</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete this rating and review?
                </p>
              </div>
            </div>

            {/* Action Buttons Toolbar Panel */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setReviewIdToDelete(null)}
                className="h-9 px-4 rounded-xl font-semibold text-xs border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmedDelete}
                disabled={deleteRatingMutation.isPending}
                className="h-9 px-4 rounded-xl font-semibold text-xs bg-red-600 hover:bg-red-700 text-white transition shadow-sm shadow-red-100"
              >
                {deleteRatingMutation.isPending ? "Deleting..." : "Delete Review"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function PatientNameLookup({ userId }: { userId: string }) {
  const { data: profile } = useQuery({
    queryKey: ["patient-profile-name", userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/api/users/${userId}`);
      return response.data;
    },
    staleTime: 15 * 60 * 1000, 
    retry: false,
  });

  const parsedName = profile?.firstName || profile?.name 
    ? `${profile.firstName || profile.name} ${profile.lastName || ""}`.trim()
    : "Verified Patient";

  return (
    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
      {parsedName}
    </span>
  );
}