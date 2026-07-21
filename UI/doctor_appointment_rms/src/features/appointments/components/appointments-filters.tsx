"use client";

import { RiSearchLine, RiCalendarLine, RiFilter3Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppointmentTabKey } from "./appointment-tabs";

interface AppointmentsFiltersProps {
  isDoctor: boolean;
  activeTab: AppointmentTabKey;
  searchQuery: string;
  dateFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearAll: () => void;
}

export function AppointmentsFilters({
  isDoctor,
  activeTab,
  searchQuery,
  dateFilter,
  statusFilter,
  onSearchChange,
  onDateChange,
  onStatusChange,
  onClearAll,
}: AppointmentsFiltersProps) {
  const hasActiveFilters = Boolean(searchQuery || dateFilter || statusFilter);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
        <RiFilter3Line size={18} className="text-slate-500" />
        <span className="text-sm font-semibold text-slate-800">Filters & Search</span>
      </div>

      <div className="p-4">
        <div className={`grid grid-cols-1 gap-3 ${activeTab === "finished" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <div className="relative">
            <RiSearchLine size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search ${isDoctor ? "patients" : "doctors"}`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 pl-10 rounded-xl bg-slate-50"
            />
          </div>

          {activeTab !== "today" && (
            <div className="relative">
              <RiCalendarLine size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="h-11 pl-10 rounded-xl bg-slate-50"
              />
            </div>
          )}

          {activeTab === "finished" && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Finished</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end mt-3">
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}