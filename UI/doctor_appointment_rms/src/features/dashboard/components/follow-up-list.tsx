"use client";

import { useGetUpcomingFollowUps } from "@/features/clinical-notes/hooks/use-clinical-notes";
import { RiCalendarEventLine } from "@remixicon/react";

export function FollowUpList() {
  const { data: followUps, isLoading } = useGetUpcomingFollowUps();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-[90px] bg-slate-100 rounded-xl border border-slate-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg tracking-tight flex items-center gap-2">
        <RiCalendarEventLine className="w-5 h-5 text-blue-600" />
        Upcoming Follow-ups
      </h3>

      {/* Replaced 'return null' with a persistent empty state */}
      {!followUps || followUps.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center">
          <p className="text-sm text-slate-500 font-medium">No pending follow-ups required.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {followUps.map((fu) => (
            <div
              key={fu.id}
              className="group flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all border-l-4 border-l-blue-500"
            >
              <img 
                src={fu.doctorPhotoUrl || "/default-avatar.png"} // Always good to have a fallback
                alt={fu.doctorName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{fu.doctorName}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {new Date(fu.followUpDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
                {fu.followUpInstructions && (
                  <div className="mt-2 inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium italic truncate max-w-full">
                    {fu.followUpInstructions}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}