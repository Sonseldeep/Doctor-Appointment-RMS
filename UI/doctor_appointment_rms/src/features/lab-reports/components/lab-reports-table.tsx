"use client";

import { useState } from "react";
import { useLabReports } from "../hooks/use-lab-reports";
import { LabReportResponse } from "../types/lab-reports.types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RiEyeLine, RiAlertFill, RiCheckboxCircleFill, RiCalendarEventLine } from "@remixicon/react";

export const LabReportsTable = () => {
  // 1. Fetch data but do not immediately assume it is an array
  const { data, isLoading, error } = useLabReports();
  const [selectedReport, setSelectedReport] = useState<LabReportResponse | null>(null);

  // 2. TypeScript Fix: Guarantee 'reports' is strictly an array of LabReportResponse
  const reports: LabReportResponse[] = Array.isArray(data) ? data : [];

  // Senior Fallback Rule: Defensively check multiple common JSON serialization keys 
  // to ensure dates parse properly regardless of .NET naming conventions
  const parseAndFormatDate = (report: any): string => {
    const rawDate = 
      report?.observationDateTime || 
      report?.ObservationDateTime || 
      report?.observationDate || 
      report?.date;

    if (!rawDate) return "N/A";

    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) return <TableSkeleton />;
  
  if (error) {
    return (
      <div className="p-8 text-center text-sm text-red-500 font-medium">
        Failed to fetch records. Please refresh or try again later.
      </div>
    );
  }

  // 3. This length check now works perfectly because we forced it into an array
  if (reports.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-slate-400 font-medium">
        No lab reports found in your medical history.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader className="bg-slate-50/70">
          <TableRow>
            <TableHead className="font-semibold text-slate-700 h-12">Lab Facility</TableHead>
            <TableHead className="font-semibold text-slate-700 h-12">Diagnostic Panel</TableHead>
            <TableHead className="font-semibold text-slate-700 h-12">Date Ordered</TableHead>
            <TableHead className="font-semibold text-slate-700 h-12 text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* 4. report is implicitly understood as LabReportResponse here */}
          {reports.map((report) => (
            <TableRow key={report.id || report.panelName} className="hover:bg-slate-50/40 transition-colors border-slate-100">
              <TableCell className="font-semibold text-slate-900 py-4">{report.labName}</TableCell>
              <TableCell className="text-slate-600 py-4">{report.panelName}</TableCell>
              <TableCell className="text-slate-500 py-4">
                <div className="flex items-center gap-1.5">
                  <RiCalendarEventLine className="w-4 h-4 text-slate-400" />
                  {parseAndFormatDate(report)}
                </div>
              </TableCell>
              <TableCell className="text-right py-4 pr-6">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-all duration-200 shadow-sm"
                >
                  <RiEyeLine className="w-3.5 h-3.5" /> View Results
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Optimized Detail Modal for Health Observations */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl w-full bg-white rounded-2xl p-6 shadow-xl gap-0 border border-slate-100">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              {selectedReport?.panelName}
            </DialogTitle>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1">
              <span>Facility: <strong className="text-slate-700 font-semibold">{selectedReport?.labName}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <RiCalendarEventLine className="w-3.5 h-3.5 text-slate-400" />
                Verified on {selectedReport && parseAndFormatDate(selectedReport)}
              </span>
            </div>
          </DialogHeader>

          {/* Clean Layout Container - Removes ugly text compression and unwanted horizontal overflow */}
          <div className="mt-5 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[500px]">
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-xs font-bold text-slate-600 h-10 w-[40%]">Test Parameter</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 h-10 w-[30%]">Result Value</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 h-10 w-[30%]">Reference Range</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600 h-10 text-right pr-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedReport?.observations.map((obs, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                      <TableCell className="font-medium text-slate-800 text-sm py-3.5 whitespace-nowrap">
                        {obs.testName}
                      </TableCell>
                      <TableCell className="text-slate-900 font-bold text-sm py-3.5">
                        {obs.value} <span className="text-xs font-normal text-slate-400 ml-0.5">{obs.unit}</span>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm py-3.5 whitespace-nowrap">
                        {obs.referenceRange}
                      </TableCell>
                      <TableCell className="text-right py-3.5 pr-4">
                        {obs.isAbnormal ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50/80 border border-red-100 px-2 py-0.5 rounded-md tracking-wide whitespace-nowrap">
                            <RiAlertFill className="w-3 h-3" /> ABNORMAL
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50/80 border border-green-100 px-2 py-0.5 rounded-md tracking-wide whitespace-nowrap">
                            <RiCheckboxCircleFill className="w-3 h-3" /> NORMAL
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TableSkeleton = () => (
  <div className="w-full space-y-4 p-6 animate-pulse bg-white rounded-2xl">
    <div className="h-10 bg-slate-100 rounded-lg w-full" />
    {[1, 2, 3].map((n) => (
      <div key={n} className="h-14 bg-slate-50 rounded-xl w-full" />
    ))}
  </div>
);