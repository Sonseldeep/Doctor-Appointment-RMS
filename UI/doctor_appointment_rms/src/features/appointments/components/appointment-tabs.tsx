"use client";

import { RiCalendarTodoLine, RiCalendarEventLine, RiArchiveLine } from "@remixicon/react";

export type AppointmentTabKey = "today" | "upcoming" | "finished";

interface TabConfig {
  key: AppointmentTabKey;
  label: string;
  icon: React.ElementType;
}

const TABS: TabConfig[] = [
  { key: "today", label: "Today", icon: RiCalendarTodoLine },
  { key: "upcoming", label: "Upcoming", icon: RiCalendarEventLine },
  { key: "finished", label: "Finished", icon: RiArchiveLine },
];

interface AppointmentTabsProps {
  activeTab: AppointmentTabKey;
  onChange: (tab: AppointmentTabKey) => void;
  counts: Record<AppointmentTabKey, number>;
}

export function AppointmentTabs({ activeTab, onChange, counts }: AppointmentTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-full sm:w-fit">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={16} />
            {label}
            <span
              className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                isActive ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}