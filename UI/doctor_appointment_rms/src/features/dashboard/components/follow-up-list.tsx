"use client";
import { useGetUpcomingFollowUps } from "@/features/clinical-notes/hooks/use-clinical-notes";
import { RiCalendarCheckLine } from "@remixicon/react";

export function FollowUpList() {
  const { data: followUps, isLoading } = useGetUpcomingFollowUps();

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading follow-ups...</div>;
  if (!followUps || followUps.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Upcoming Follow-Ups</h3>
      {followUps.map((fu) => (
        <div
          key={fu.id}
          className="rounded-lg border bg-white p-4 border-l-4 border-l-blue-500 shadow-sm"
        >
          <div className="flex gap-3">
            <img 
              src={fu.doctorPhotoUrl} 
              alt={fu.doctorName} 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div>
              <p className="font-medium text-sm">{fu.doctorName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(fu.followUpDate).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
              <p className="text-xs text-blue-600 mt-2 font-medium italic">
                {fu.followUpInstructions}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}