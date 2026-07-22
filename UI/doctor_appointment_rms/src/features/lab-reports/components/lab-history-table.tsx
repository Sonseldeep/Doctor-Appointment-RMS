"use client";

import { useQuery } from "@tanstack/react-query";
import { labReportsApi } from "../api/lab-reports-api";
import {
  RiHistoryLine,
  RiLoader4Line,
  RiTestTubeLine,
  RiFilePdf2Line,
  RiUser3Line,
} from "@remixicon/react";

export function LabHistoryTable() {
  const { data: history, isLoading, isError } = useQuery({
    queryKey: ["sentLabHistory"],
    queryFn: () => labReportsApi.getLabHistory(),
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center text-slate-800">
          <div className="flex items-center gap-2">
            <RiHistoryLine className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm">Sent Lab Reports History</h3>
          </div>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {history?.length || 0} Reports
          </span>
        </div>

        {/* Loading / Error / Data View */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <RiLoader4Line className="w-7 h-7 text-blue-600 animate-spin" />
            <span className="text-sm font-semibold">Fetching dispatched reports...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500 text-sm font-semibold">
            Failed to load report history. Please refresh or try again later.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Patient Details</th>
                  <th className="px-6 py-3.5">Test Panel</th>
                  <th className="px-6 py-3.5">Facility</th>
                  <th className="px-6 py-3.5">Records Summary</th>
                  <th className="px-6 py-3.5">Date Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {history && history.length > 0 ? (
                  history.map((report) => (
                    <tr
                      key={report.labReportId}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Patient */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                            <RiUser3Line className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {report.patientFirstName} {report.patientLastName}
                            </p>
                            <p className="text-xs text-slate-500">{report.patientEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Panel */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          <RiTestTubeLine className="w-3.5 h-3.5 text-blue-600" />
                          {report.panelName}
                        </span>
                      </td>

                      {/* Facility */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {report.labName}
                      </td>

                      {/* Summary Badges */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-blue-100">
                            {report.observationCount} Observations
                          </span>
                          {report.documentCount > 0 && (
                            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                              <RiFilePdf2Line className="w-3 h-3" />
                              {report.documentCount} Attachments
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {formatDate(report.sentAtUtc)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 text-sm font-medium">
                      No sent lab reports found in history.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}