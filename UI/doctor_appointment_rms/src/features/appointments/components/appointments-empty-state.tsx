import { RiCalendarLine, RiInboxArchiveLine, RiCalendarCheckLine } from "@remixicon/react";
import { AppointmentTabKey } from "./appointment-tabs";

const EMPTY_STATE_CONTENT: Record<AppointmentTabKey,
  { icon: React.ElementType; title: string; description: string }
> = {
  today: {
    icon: RiCalendarCheckLine,
    title: "No appointments today",
    description: "You're all clear for today. Enjoy the breathing room!",
  },
  upcoming: {
    icon: RiCalendarLine,
    title: "Nothing on the horizon",
    description: "No upcoming appointments match your filters right now.",
  },
  finished: {
    icon: RiInboxArchiveLine,
    title: "No finished appointments",
    description: "Completed and cancelled appointments will show up here.",
  },
};

interface AppointmentsEmptyStateProps {
  tab: AppointmentTabKey;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function AppointmentsEmptyState({ tab, hasActiveFilters, onClearFilters }: AppointmentsEmptyStateProps) {
  const content = EMPTY_STATE_CONTENT[tab];
  const Icon = content.icon;

  return (
    <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
      <div className="bg-white p-3 rounded-full shadow-sm mb-3">
        <Icon size={24} className="text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{hasActiveFilters ? "No matches found" : content.title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        {hasActiveFilters ? "Try adjusting or clearing your filters." : content.description}
      </p>
      {hasActiveFilters && onClearFilters && (
        <button type="button" onClick={onClearFilters} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700">
          Clear filters
        </button>
      )}
    </div>
  );
}